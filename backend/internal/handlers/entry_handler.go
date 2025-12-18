package handlers

import (
	"net/http"
	"sgh-backend/internal/repository"
	"sgh-backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetEntries(c *gin.Context) {
	empID, _ := strconv.Atoi(c.Query("employee_id"))
	start := c.Query("start_date")
	end := c.Query("end_date")

	entries, err := repository.GetEntries(empID, start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, entries)
}

func CreateEntry(c *gin.Context) {
	var e models.Entry
	if err := c.BindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	e, err := repository.CreateEntry(e)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}

func UpdateEntry(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var e models.Entry
	if err := c.BindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	e, err := repository.UpdateEntry(id, e)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}
