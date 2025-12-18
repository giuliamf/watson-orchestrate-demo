package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"sgh-backend/internal/db2"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		godotenv.Load("../internal/config/.env")
		godotenv.Load("internal/config/.env")
	}

	// Adjust path as needed
	file, err := os.Open("../../mock_dados_db2.csv")
	if err != nil {
		file, err = os.Open("../mock_dados_db2.csv")
		if err != nil {
			// Try current directory if running from root
			file, err = os.Open("mock_dados_db2.csv")
			if err != nil {
				log.Fatal("Could not open csv file:", err)
			}
		}
	}
	defer file.Close()

	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		log.Fatal(err)
	}

	createSchema()

	// Maps to store IDs
	employees := make(map[string]int)
	workItems := make(map[string]int)

	// Default Contract
	contractID := createContract(1.0, 1.5, 1.2, 1.2, 1.5)

	for i, record := range records {
		if i == 0 {
			continue // Skip header
		}

		// record: Created On, State, Reported By, Reported Date, Week Ending Date, Sent to CFT Date, Duration, Activity, Activity Description, Billing Rate, IBM WorkItem

		reportedBy := record[2]
		reportedDate := record[3]
		duration, _ := strconv.ParseFloat(record[6], 64)
		activity := record[7]
		description := record[8]
		wiCode := record[10]

		// Employee
		if _, exists := employees[reportedBy]; !exists {
			id := createEmployee(reportedBy, "TECH")
			employees[reportedBy] = id
		}
		empID := employees[reportedBy]

		// WorkItem
		wiKey := wiCode // Assume unique by code
		if _, exists := workItems[wiKey]; !exists {
			desc := activity
			if description != "" {
				desc = description // Use specific description if available, or maybe combine?
			}
			id := createWorkItem(wiCode, desc, 1000.0, contractID) // Default budget
			workItems[wiKey] = id
		}
		wiID := workItems[wiKey]

		// Entry
		createEntry(empID, wiID, reportedDate, duration, description)
		fmt.Printf("Processed row %d\n", i)
	}
}

func execSQL(sql string) {
	_, err := db2.Query[any](sql)
	if err != nil {
		// Ignore errors for drop table if not exists, but log others
		if !strings.Contains(sql, "DROP TABLE") {
			log.Printf("SQL Error: %v\nQuery: %s", err, sql)
		}
	}
}

func createSchema() {
	execSQL("DROP TABLE ENTRIES")
	execSQL("DROP TABLE WORKITEMS")
	execSQL("DROP TABLE EMPLOYEES")
	execSQL("DROP TABLE CONTRACTS")

	execSQL(`CREATE TABLE CONTRACTS (
		ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		RATE_BUSINESS DOUBLE,
		RATE_SUN_HOLIDAY DOUBLE,
		RATE_SAT_DAY DOUBLE,
		RATE_EVENING DOUBLE,
		RATE_NIGHT DOUBLE
	)`)

	execSQL(`CREATE TABLE EMPLOYEES (
		ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		NAME VARCHAR(100),
		ROLE VARCHAR(20)
	)`)

	execSQL(`CREATE TABLE WORKITEMS (
		ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		WI_CODE VARCHAR(50),
		DESCRIPTION VARCHAR(255),
		TOTAL_BUDGET_HOURS DOUBLE,
		CONTRACT_ID INT,
		FOREIGN KEY (CONTRACT_ID) REFERENCES CONTRACTS(ID)
	)`)

	execSQL(`CREATE TABLE ENTRIES (
		ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
		EMPLOYEE_ID INT,
		WORK_ITEM_ID INT,
		DATE DATE,
		START_TIME VARCHAR(10),
		END_TIME VARCHAR(10),
		MANUAL_HOURS DOUBLE,
		DESCRIPTION VARCHAR(255),
		FOREIGN KEY (EMPLOYEE_ID) REFERENCES EMPLOYEES(ID),
		FOREIGN KEY (WORK_ITEM_ID) REFERENCES WORKITEMS(ID)
	)`)
}

func createContract(rb, rsh, rsd, re, rn float64) int {
	// DB2 doesn't return ID easily with Query, unless we select it back.
	// But generated always as identity...
	// We can select MAX(ID) after insert.
	sql := fmt.Sprintf("INSERT INTO CONTRACTS (RATE_BUSINESS, RATE_SUN_HOLIDAY, RATE_SAT_DAY, RATE_EVENING, RATE_NIGHT) VALUES (%f, %f, %f, %f, %f)", rb, rsh, rsd, re, rn)
	execSQL(sql)
	return getLastID("CONTRACTS")
}

func createEmployee(name, role string) int {
	sql := fmt.Sprintf("INSERT INTO EMPLOYEES (NAME, ROLE) VALUES ('%s', '%s')", name, role)
	execSQL(sql)
	return getLastID("EMPLOYEES")
}

func createWorkItem(code, desc string, budget float64, contractID int) int {
	desc = strings.ReplaceAll(desc, "'", "''")
	sql := fmt.Sprintf("INSERT INTO WORKITEMS (WI_CODE, DESCRIPTION, TOTAL_BUDGET_HOURS, CONTRACT_ID) VALUES ('%s', '%s', %f, %d)", code, desc, budget, contractID)
	execSQL(sql)
	return getLastID("WORKITEMS")
}

func createEntry(empID, wiID int, date string, hours float64, desc string) {
	desc = strings.ReplaceAll(desc, "'", "''")
	sql := fmt.Sprintf("INSERT INTO ENTRIES (EMPLOYEE_ID, WORK_ITEM_ID, DATE, MANUAL_HOURS, DESCRIPTION) VALUES (%d, %d, '%s', %f, '%s')", empID, wiID, date, hours, desc)
	execSQL(sql)
}

type IDResult struct {
	ID int `json:"1"` // DB2 might return "1" or "ID" or column index?
}

func getLastID(table string) int {
	// IDENTITY_VAL_LOCAL() is for current session.
	// Or SELECT MAX(ID) FROM table
	sql := fmt.Sprintf("SELECT MAX(ID) as ID FROM %s", table)

	// Query returns []T. We need a struct that matches the response.
	// If the response is {"rows": [{"ID": 5}]}
	type Res struct {
		ID int `json:"ID"`
	}
	rows, err := db2.Query[Res](sql)
	if err != nil || len(rows) == 0 {
		log.Printf("Error getting ID: %v", err)
		return 0
	}
	return rows[0].ID
}
