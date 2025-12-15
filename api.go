package main

import (
	"fmt"
	"os"
	"path/filepath"
	"sgh-backend/models"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// --- FUNÇÕES AUXILIARES DE CÁLCULO (MANTIDAS) ---

func getMultiplierForTime(t time.Time, c models.Contract) float64 {
	hour := t.Hour()
	weekday := t.Weekday()
	if weekday == time.Sunday {
		return c.RateSunHoliday
	}
	if weekday == time.Saturday {
		if hour >= 9 && hour < 18 {
			return c.RateSatDay
		}
		if hour >= 18 {
			return c.RateSatNight
		}
		return c.RateNight
	}
	if hour >= 9 && hour < 18 {
		return c.RateBusiness
	}
	if hour >= 18 && hour < 22 {
		return c.RateEvening
	}
	return c.RateNight
}

func calculateBillable(date time.Time, startStr, endStr string, manualHours float64, contract models.Contract) (float64, float64) {
	startInfo, _ := time.Parse("15:04", startStr)
	endInfo, _ := time.Parse("15:04", endStr)
	start := time.Date(date.Year(), date.Month(), date.Day(), startInfo.Hour(), startInfo.Minute(), 0, 0, date.Location())
	end := time.Date(date.Year(), date.Month(), date.Day(), endInfo.Hour(), endInfo.Minute(), 0, 0, date.Location())
	if end.Before(start) {
		end = end.Add(24 * time.Hour)
	}

	totalMinutes := end.Sub(start).Minutes()
	if totalMinutes <= 0 {
		return 0, 0
	}

	var sumMultipliers float64 = 0
	current := start
	for current.Before(end) {
		sumMultipliers += getMultiplierForTime(current, contract)
		current = current.Add(time.Minute)
	}
	averageRate := sumMultipliers / totalMinutes
	finalBillable := manualHours * averageRate
	return manualHours, finalBillable
}

func SetupRouter(db *gorm.DB) *gin.Engine {
	// --- DIAGNÓSTICO DE ARQUIVOS (Para descobrir o erro) ---
	ex, _ := os.Getwd()
	indexPath := filepath.Join(ex, "dist", "index.html")
	fmt.Println("------------------------------------------------")
	fmt.Println("DIRETÓRIO ATUAL:", ex)
	fmt.Println("PROCURANDO SITE EM:", indexPath)

	if _, err := os.Stat(indexPath); os.IsNotExist(err) {
		fmt.Println("❌ ERRO CRÍTICO: O arquivo 'index.html' NÃO foi encontrado!")
		fmt.Println("   Certifique-se de que a pasta 'dist' está junto com o 'main.go'.")
	} else {
		fmt.Println("✅ ARQUIVO ENCONTRADO! O site deve carregar.")
	}
	fmt.Println("------------------------------------------------")

	r := gin.Default()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type"}
	r.Use(cors.New(config))

	createLog := func(action, details, user string) {
		db.Create(&models.AuditLog{Action: action, Details: details, UserName: user, Timestamp: time.Now()})
	}

	// --- SERVIR O FRONTEND (CORRIGIDO) ---

	// 1. Serve a pasta de Assets (CSS, JS, Imagens)
	r.Static("/assets", "./dist/assets")

	// 2. Rota explícita para a Raiz (Home) - Substitui StaticFile que pode falhar
	r.GET("/", func(c *gin.Context) {
		c.File("./dist/index.html")
	})

	// 3. Fallback para React Router (Qualquer outra rota desconhecida vai para o index)
	r.NoRoute(func(c *gin.Context) {
		// Se não for API, entrega o site
		c.File("./dist/index.html")
	})

	// --- ROTAS DA API ---
	r.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "pong"}) })

	r.GET("/workitems", func(c *gin.Context) {
		var wis []models.WorkItem
		db.Preload("Contract").Find(&wis)
		c.JSON(200, wis)
	})

	r.GET("/workitems/:id/details", func(c *gin.Context) {
		id := c.Param("id")
		var entries []models.TimeEntry
		if err := db.Preload("Employee").Where("work_item_id = ?", id).Order("date desc").Find(&entries).Error; err != nil {
			c.JSON(500, gin.H{"error": "Erro ao buscar detalhes"})
			return
		}
		c.JSON(200, entries)
	})

	r.GET("/audit-logs", func(c *gin.Context) {
		var logs []models.AuditLog
		db.Order("timestamp desc").Limit(50).Find(&logs)
		c.JSON(200, logs)
	})

	r.POST("/workitems", func(c *gin.Context) {
		type CreateInput struct {
			ContractNumber string  `json:"contract_number"`
			Code           string  `json:"code"`
			Description    string  `json:"description"`
			TotalBudget    float64 `json:"total_budget"`
			ManagerName    string  `json:"manager_name"`
			RateBusiness   float64 `json:"rate_business"`
			RateEvening    float64 `json:"rate_evening"`
			RateNight      float64 `json:"rate_night"`
			RateSatDay     float64 `json:"rate_sat_day"`
			RateSatNight   float64 `json:"rate_sat_night"`
			RateSunHoliday float64 `json:"rate_sun_holiday"`
		}
		var req CreateInput
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		var contract models.Contract
		result := db.Where("contract_number = ?", req.ContractNumber).First(&contract)
		contract.ContractNumber = req.ContractNumber
		contract.RateBusiness = req.RateBusiness
		contract.RateEvening = req.RateEvening
		contract.RateNight = req.RateNight
		contract.RateSatDay = req.RateSatDay
		contract.RateSatNight = req.RateSatNight
		contract.RateSunHoliday = req.RateSunHoliday

		if result.RowsAffected == 0 {
			db.Create(&contract)
		} else {
			db.Save(&contract)
		}

		wi := models.WorkItem{Code: req.Code, Description: req.Description, TotalBudgetHours: req.TotalBudget, ContractID: contract.ID}
		db.Create(&wi)
		createLog("Criação Projeto", fmt.Sprintf("WI %s criado", req.Code), req.ManagerName)
		c.JSON(201, wi)
	})

	r.PUT("/workitems/:id", func(c *gin.Context) {
		id := c.Param("id")
		type UpdateInput struct {
			Description string  `json:"description"`
			TotalBudget float64 `json:"total_budget"`
		}
		var req UpdateInput
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		var wi models.WorkItem
		if err := db.First(&wi, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "WI não encontrado"})
			return
		}
		wi.Description = req.Description
		wi.TotalBudgetHours = req.TotalBudget
		db.Save(&wi)
		createLog("Edição Projeto", fmt.Sprintf("WI %s editado", wi.Code), "PM")
		c.JSON(200, wi)
	})

	r.DELETE("/workitems/:id", func(c *gin.Context) {
		id := c.Param("id")
		var wi models.WorkItem
		if err := db.First(&wi, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "WI não encontrado"})
			return
		}
		db.Where("work_item_id = ?", id).Delete(&models.TimeEntry{})
		db.Delete(&wi)
		createLog("Exclusão Projeto", fmt.Sprintf("WI %s excluído", wi.Code), "PM")
		c.JSON(200, gin.H{"message": "Projeto excluído"})
	})

	r.POST("/entries", func(c *gin.Context) {
		type EntryInput struct {
			EmployeeID  uint    `json:"employee_id"`
			WorkItemID  uint    `json:"work_item_id"`
			Date        string  `json:"date"`
			StartTime   string  `json:"start_time"`
			EndTime     string  `json:"end_time"`
			ManualHours float64 `json:"manual_hours"`
			Description string  `json:"description"`
		}
		var input EntryInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "JSON inválido"})
			return
		}
		if input.WorkItemID == 0 {
			c.JSON(400, gin.H{"error": "Projeto inválido."})
			return
		}

		var wi models.WorkItem
		if err := db.Preload("Contract").First(&wi, input.WorkItemID).Error; err != nil {
			c.JSON(404, gin.H{"error": "WI não encontrado"})
			return
		}

		dateObj, _ := time.Parse("2006-01-02", input.Date)
		calcDuration, billable := calculateBillable(dateObj, input.StartTime, input.EndTime, input.ManualHours, wi.Contract)

		saldo := wi.TotalBudgetHours - wi.UsedHours
		if input.ManualHours > saldo {
			c.JSON(403, gin.H{"error": "Saldo insuficiente"})
			return
		}

		entry := models.TimeEntry{
			EmployeeID: input.EmployeeID, WorkItemID: input.WorkItemID, Date: dateObj,
			StartTime: input.StartTime, EndTime: input.EndTime, ManualHours: input.ManualHours,
			CalculatedDuration: calcDuration, HoursBillable: billable, ActivityDescription: input.Description,
		}
		db.Create(&entry)

		wi.UsedHours += billable
		wi.BillableHours += billable
		db.Save(&wi)

		createLog("Lançamento", fmt.Sprintf("Horas: %.2f | Fat: %.2f", input.ManualHours, billable), "Tech")
		c.JSON(201, gin.H{"message": "Sucesso", "id": entry.ID})
	})

	return r
}
