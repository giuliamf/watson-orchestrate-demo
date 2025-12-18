package repository

import (
	"fmt"
	"sgh-backend/internal/db2"
	"sgh-backend/models"
)

func GetContractByID(id int) (*models.Contract, error) {
	sql := fmt.Sprintf("SELECT ID, RATE_BUSINESS, RATE_SUN_HOLIDAY, RATE_SAT_DAY, RATE_EVENING, RATE_NIGHT FROM CONTRACTS WHERE ID = %d", id)
	rows, err := db2.Query[models.Contract](sql)
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return &rows[0], nil
}
