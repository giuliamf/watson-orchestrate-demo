package router

import (
	"sgh-backend/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()

	r.Use(cors.Default())

	r.GET("/health", handlers.HealthCheck)

	// WorkItems routes
	r.GET("/workitems", handlers.GetWorkItems)
	r.GET("/workitems/:id/details", handlers.GetWorkItemDetails)

	// Entries routes
	r.GET("/entries", handlers.GetEntries)
	r.POST("/entries", handlers.CreateEntry)
	r.PUT("/entries/:id", handlers.UpdateEntry)

	r.GET("/audit-logs", func(c *gin.Context) {
		c.JSON(200, []string{})
	})

	return r
}
