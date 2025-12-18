package handlers

import (
	"net/http"

	"sgh-backend/internal/db2"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func HealthDB(c *gin.Context) {
	if err := db2.HealthCheck(); err != nil {
		c.JSON(503, gin.H{
			"db2":   "down",
			"error": err.Error(),
		})
		return
	}

	c.JSON(200, gin.H{
		"db2": "up",
	})
}
