package main

import (
	"fmt"
	"log"
	"sgh-backend/models"
	"time"

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

	wi := models.WorkItem{Code: "WI-998877", Description: "Sustentação Cloud", TotalBudgetHours: 2016.0, Status: "active", ContractID: contract.ID}
	db.FirstOrCreate(&wi, models.WorkItem{Code: "WI-998877"})

	var daniel models.Employee
	db.FirstOrCreate(&daniel, models.Employee{Name: "Daniel", Role: "TECH", Email: "daniel@ibm.com"})
	db.FirstOrCreate(&models.Employee{}, models.Employee{Name: "Ana", Role: "PM", Email: "ana@ibm.com"})

	// Popula horas importadas de outro sistema (simulação)
	populateImportedHours(db, daniel.ID, wi.ID, contract)
}

func populateImportedHours(db *gorm.DB, employeeID, workItemID uint, contract models.Contract) {
	// Verifica se já existem entradas importadas
	var count int64
	db.Model(&models.TimeEntry{}).Where("employee_id = ? AND is_imported = ?", employeeID, true).Count(&count)
	if count > 0 {
		fmt.Println("✅ Horas importadas já existem no banco")
		return
	}

	fmt.Println("📥 Importando horas de exemplo do sistema externo...")

	// Simula dados importados da semana atual
	now := time.Now()
	weekday := int(now.Weekday())
	startOfWeek := now.AddDate(0, 0, -weekday) // Domingo

	entries := []struct {
		dayOffset int
		hours     float64
		desc      string
		start     string
		end       string
	}{
		{1, 8.0, "Monitoramento de infraestrutura e resolução de incidentes", "09:00", "18:00"}, // Segunda
		{2, 7.5, "Deploy de aplicações e configuração de ambientes", "09:00", "17:30"},          // Terça
		{3, 8.0, "Análise de logs e otimização de performance", "09:00", "18:00"},               // Quarta
		{4, 6.0, "Reuniões técnicas e documentação", "09:00", "16:00"},                          // Quinta
		{5, 8.0, "Suporte a incidentes críticos e troubleshooting", "09:00", "18:00"},           // Sexta
		// Sábado (6) e Domingo (0) não têm horas - ninguém trabalha nesses dias
	}

	var wi models.WorkItem
	db.Preload("Contract").First(&wi, workItemID)

	for _, e := range entries {
		entryDate := startOfWeek.AddDate(0, 0, e.dayOffset)

		// Calcula horas faturáveis usando a mesma lógica do sistema
		dateObj := time.Date(entryDate.Year(), entryDate.Month(), entryDate.Day(), 0, 0, 0, 0, time.UTC)
		calcDuration, billable := calculateBillable(dateObj, e.start, e.end, e.hours, contract)

		entry := models.TimeEntry{
			EmployeeID:          employeeID,
			WorkItemID:          workItemID,
			Date:                entryDate,
			StartTime:           e.start,
			EndTime:             e.end,
			ManualHours:         e.hours,
			CalculatedDuration:  calcDuration,
			HoursBillable:       billable,
			ActivityDescription: e.desc,
			IsImported:          true,
		}
		db.Create(&entry)

		// Atualiza o WorkItem
		wi.UsedHours += billable
		wi.BillableHours += billable
	}

	db.Save(&wi)
	fmt.Printf("✅ Importadas %d entradas de horas (Total: %.1fh)\n", len(entries), 37.5)
}
