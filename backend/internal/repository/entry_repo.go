package repository

import (
	"fmt"
	"sgh-backend/internal/db2"
	"sgh-backend/models"
	"strings"
)

func GetEntries(employeeID int, startDate, endDate string) ([]models.Entry, error) {
	sql := fmt.Sprintf(`SELECT ID, EMPLOYEE_ID, WORK_ITEM_ID, DATE, START_TIME, END_TIME, MANUAL_HOURS, DESCRIPTION
                        FROM ENTRIES 
                        WHERE EMPLOYEE_ID = %d AND DATE >= '%s' AND DATE <= '%s'`, employeeID, startDate, endDate)

	// DB2 response keys
	type EntryRow struct {
		ID          int     `json:"ID"`
		EmployeeID  int     `json:"EMPLOYEE_ID"`
		WorkItemID  int     `json:"WORK_ITEM_ID"`
		Date        string  `json:"DATE"`
		StartTime   string  `json:"START_TIME"`
		EndTime     string  `json:"END_TIME"`
		ManualHours float64 `json:"MANUAL_HOURS"`
		Description string  `json:"DESCRIPTION"`
	}

	rows, err := db2.Query[EntryRow](sql)
	if err != nil {
		return nil, err
	}

	var entries []models.Entry
	for _, r := range rows {
		entries = append(entries, models.Entry{
			ID:          r.ID,
			EmployeeID:  r.EmployeeID,
			WorkItemID:  r.WorkItemID,
			Date:        r.Date,
			StartTime:   r.StartTime,
			EndTime:     r.EndTime,
			ManualHours: r.ManualHours,
			Description: r.Description,
		})
	}
	return entries, nil
}

func CreateEntry(e models.Entry) (models.Entry, error) {
	desc := strings.ReplaceAll(e.Description, "'", "''")
	sql := fmt.Sprintf(`INSERT INTO ENTRIES (EMPLOYEE_ID, WORK_ITEM_ID, DATE, START_TIME, END_TIME, MANUAL_HOURS, DESCRIPTION) 
                        VALUES (%d, %d, '%s', '%s', '%s', %f, '%s')`,
		e.EmployeeID, e.WorkItemID, e.Date, e.StartTime, e.EndTime, e.ManualHours, desc)

	_, err := db2.Query[any](sql)
	if err != nil {
		return e, err
	}

	// Get ID
	sqlID := "SELECT MAX(ID) as ID FROM ENTRIES"
	type Res struct{ ID int `json:"ID"` }
	rows, err := db2.Query[Res](sqlID)
	if err == nil && len(rows) > 0 {
		e.ID = rows[0].ID
	}
	return e, nil
}

func UpdateEntry(id int, e models.Entry) (models.Entry, error) {
	desc := strings.ReplaceAll(e.Description, "'", "''")
	sql := fmt.Sprintf(`UPDATE ENTRIES SET MANUAL_HOURS = %f, DESCRIPTION = '%s' WHERE ID = %d`,
		e.ManualHours, desc, id)
	_, err := db2.Query[any](sql)
	e.ID = id
	return e, err
}
