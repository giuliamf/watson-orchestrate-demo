package repository

import (
	"fmt"
	"sgh-backend/internal/db2"
	"sgh-backend/models"
)

func GetAllEmployees() ([]models.Employee, error) {
	sql := "SELECT ID, NAME, ROLE FROM EMPLOYEES"
	return db2.Query[models.Employee](sql)
}

func GetEmployeeByID(id int) (*models.Employee, error) {
	sql := fmt.Sprintf("SELECT ID, NAME, ROLE FROM EMPLOYEES WHERE ID = %d", id)
	rows, err := db2.Query[models.Employee](sql)
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return &rows[0], nil
}
