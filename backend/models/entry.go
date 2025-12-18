package models

type Entry struct {
	ID          int     `json:"id"`
	EmployeeID  int     `json:"employee_id"`
	WorkItemID  int     `json:"work_item_id"`
	Date        string  `json:"date"`
	StartTime   string  `json:"start_time"`
	EndTime     string  `json:"end_time"`
	ManualHours float64 `json:"manual_hours"`
	Description string  `json:"description"`
}

type EntryDetails struct {
	Entry
	Employee Employee `json:"employee"`
}
