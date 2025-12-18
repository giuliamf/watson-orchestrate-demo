package models

type WorkItem struct {
	ID               int      `json:"ID"`
	WICode           string   `json:"wi_code"`
	Description      string   `json:"description"`
	TotalBudgetHours float64  `json:"total_budget_hours"`
	UsedHours        float64  `json:"used_hours"`
	ContractID       int      `json:"contract_id"`
	Contract         Contract `json:"contract"`
}
