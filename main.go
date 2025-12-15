package main

import (
	"fmt"
	"log"
	"sgh-backend/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("sgh.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Atualizando tabelas e regras...")
	db.AutoMigrate(&models.Contract{}, &models.WorkItem{}, &models.Employee{}, &models.TimeEntry{}, &models.AuditLog{})

	// FORÇA A ATUALIZAÇÃO DAS REGRAS (Fix para o problema de Domingo = 1x)
	createDummyData(db)

	fmt.Println("Sistema Online na porta 8080 🚀")
	r := SetupRouter(db)
	r.Run(":8080")
}

func createDummyData(db *gorm.DB) {
	// Define a regra padrão
	contractRule := models.Contract{
		RateBusiness: 1.0, RateEvening: 1.5, RateNight: 2.0,
		RateSatDay: 1.5, RateSatNight: 2.0, RateSunHoliday: 2.5, // <--- Aqui está o 2.5x
	}

	// Atualiza TODOS os contratos existentes para usar essa regra (para consertar seu projeto de teste)
	db.Model(&models.Contract{}).Where("1=1").Updates(contractRule)

	// Garante que o contrato base exista
	contract := models.Contract{ContractNumber: "CN-IBM-2024-X", ClientName: "Banco Exemplo"}
	db.Where(models.Contract{ContractNumber: "CN-IBM-2024-X"}).Assign(contractRule).FirstOrCreate(&contract)

	wi := models.WorkItem{Code: "WI-998877", Description: "Sustentação Cloud", TotalBudgetHours: 2016.0, ContractID: contract.ID}
	db.FirstOrCreate(&wi, models.WorkItem{Code: "WI-998877"})

	db.FirstOrCreate(&models.Employee{}, models.Employee{Name: "Daniel", Role: "TECH", Email: "daniel@ibm.com"})
	db.FirstOrCreate(&models.Employee{}, models.Employee{Name: "Ana", Role: "PM", Email: "ana@ibm.com"})
}
