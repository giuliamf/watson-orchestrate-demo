package models

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleTech Role = "TECHNICIAN"
	RolePM   Role = "PM"
)

type Contract struct {
	gorm.Model
	ContractNumber string  `gorm:"uniqueIndex;not null" json:"contract_number"`
	ClientName     string  `json:"client_name"`
	TotalValue     float64 `json:"total_value"`

	// Multiplicadores
	RateBusiness   float64 `json:"rate_business"`
	RateEvening    float64 `json:"rate_evening"`
	RateNight      float64 `json:"rate_night"`
	RateSatDay     float64 `json:"rate_sat_day"`
	RateSatNight   float64 `json:"rate_sat_night"`
	RateSunHoliday float64 `json:"rate_sun_holiday"`

	WorkItems []WorkItem `json:"work_items,omitempty"`
}

type WorkItem struct {
	gorm.Model
	Code             string   `gorm:"uniqueIndex;not null" json:"wi_code"`
	Description      string   `json:"description"`
	TotalBudgetHours float64  `json:"total_budget_hours"`
	UsedHours        float64  `json:"used_hours"`
	BillableHours    float64  `json:"billable_hours"`
	Status           string   `gorm:"default:'active'" json:"status"` // 'active', 'completed', 'on_hold'
	ContractID       uint     `json:"contract_id"`
	Contract         Contract `json:"contract"`
}

type Employee struct {
	gorm.Model
	Name  string `json:"name"`
	Role  Role   `json:"role"`
	Email string `gorm:"uniqueIndex" json:"email"`
}

type TimeEntry struct {
	gorm.Model
	EmployeeID          uint      `json:"employee_id"`
	Employee            Employee  `json:"employee"`
	WorkItemID          uint      `json:"work_item_id"`
	WorkItem            WorkItem  `json:"work_item"`
	Date                time.Time `json:"date"`
	StartTime           string    `json:"start_time"`
	EndTime             string    `json:"end_time"`
	ManualHours         float64   `json:"manual_hours"`
	CalculatedDuration  float64   `json:"calculated_duration"`
	HoursBillable       float64   `json:"hours_billable"`
	ActivityDescription string    `gorm:"type:text" json:"description"`

	// CORREÇÃO: Campo adicionado de volta para suportar o import.go
	IsImported bool `gorm:"default:false" json:"is_imported"`
}

type AuditLog struct {
	gorm.Model
	Action    string    `json:"action"`
	Details   string    `json:"details"`
	UserName  string    `json:"user_name"`
	Timestamp time.Time `json:"timestamp"`
}

func (wi *WorkItem) CalculateUtilization() float64 {
	if wi.TotalBudgetHours == 0 {
		return 0.0
	}
	return (wi.UsedHours / wi.TotalBudgetHours) * 100
}
