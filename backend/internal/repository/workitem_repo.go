package repository

import (
	"fmt"
	"sgh-backend/internal/db2"
	"sgh-backend/models"
)

type WorkItemFlat struct {
	ID               int     `json:"ID"`
	WICode           string  `json:"WI_CODE"`
	Description      string  `json:"DESCRIPTION"`
	TotalBudgetHours float64 `json:"TOTAL_BUDGET_HOURS"`
	ContractID       int     `json:"CONTRACT_ID"`
	RateBusiness     float64 `json:"RATE_BUSINESS"`
	RateSunHoliday   float64 `json:"RATE_SUN_HOLIDAY"`
	RateSatDay       float64 `json:"RATE_SAT_DAY"`
	RateEvening      float64 `json:"RATE_EVENING"`
	RateNight        float64 `json:"RATE_NIGHT"`
	UsedHours        float64 `json:"USED_HOURS"`
}

func GetAllWorkItems() ([]models.WorkItem, error) {
	sql := `SELECT w.ID, w.WI_CODE, w.DESCRIPTION, w.TOTAL_BUDGET_HOURS, w.CONTRACT_ID,
                   c.RATE_BUSINESS, c.RATE_SUN_HOLIDAY, c.RATE_SAT_DAY, c.RATE_EVENING, c.RATE_NIGHT,
                   COALESCE(e.USED, 0) as USED_HOURS
            FROM WORKITEMS w
            JOIN CONTRACTS c ON w.CONTRACT_ID = c.ID
            LEFT JOIN (SELECT WORK_ITEM_ID, SUM(MANUAL_HOURS) as USED FROM ENTRIES GROUP BY WORK_ITEM_ID) e ON w.ID = e.WORK_ITEM_ID`

	rows, err := db2.Query[WorkItemFlat](sql)
	if err != nil {
		return nil, err
	}

	var items []models.WorkItem
	for _, r := range rows {
		items = append(items, models.WorkItem{
			ID:               r.ID,
			WICode:           r.WICode,
			Description:      r.Description,
			TotalBudgetHours: r.TotalBudgetHours,
			UsedHours:        r.UsedHours,
			ContractID:       r.ContractID,
			Contract: models.Contract{
				ID:             r.ContractID,
				RateBusiness:   r.RateBusiness,
				RateSunHoliday: r.RateSunHoliday,
				RateSatDay:     r.RateSatDay,
				RateEvening:    r.RateEvening,
				RateNight:      r.RateNight,
			},
		})
	}
	return items, nil
}

func GetWorkItemEntries(workItemID int) ([]models.EntryDetails, error) {
	sql := fmt.Sprintf(`SELECT e.ID, e.EMPLOYEE_ID, e.WORK_ITEM_ID, e.DATE, e.START_TIME, e.END_TIME, e.MANUAL_HOURS, e.DESCRIPTION,
                   emp.NAME as EMP_NAME, emp.ROLE as EMP_ROLE
            FROM ENTRIES e
            JOIN EMPLOYEES emp ON e.EMPLOYEE_ID = emp.ID
            WHERE e.WORK_ITEM_ID = %d`, workItemID)

	type EntryDetailsRow struct {
		ID          int     `json:"ID"`
		EmployeeID  int     `json:"EMPLOYEE_ID"`
		WorkItemID  int     `json:"WORK_ITEM_ID"`
		Date        string  `json:"DATE"`
		StartTime   string  `json:"START_TIME"`
		EndTime     string  `json:"END_TIME"`
		ManualHours float64 `json:"MANUAL_HOURS"`
		Description string  `json:"DESCRIPTION"`
		EmpName     string  `json:"EMP_NAME"`
		EmpRole     string  `json:"EMP_ROLE"`
	}

	rows, err := db2.Query[EntryDetailsRow](sql)
	if err != nil {
		return nil, err
	}

	var entries []models.EntryDetails
	for _, r := range rows {
		entries = append(entries, models.EntryDetails{
			Entry: models.Entry{
				ID:          r.ID,
				EmployeeID:  r.EmployeeID,
				WorkItemID:  r.WorkItemID,
				Date:        r.Date,
				StartTime:   r.StartTime,
				EndTime:     r.EndTime,
				ManualHours: r.ManualHours,
				Description: r.Description,
			},
			Employee: models.Employee{
				ID:   r.EmployeeID,
				Name: r.EmpName,
				Role: r.EmpRole,
			},
		})
	}
	return entries, nil
}
