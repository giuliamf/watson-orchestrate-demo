package handlers

import (
	"net/http"
	"sgh-backend/internal/repository"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetWorkItems(c *gin.Context) {
	items, err := repository.GetAllWorkItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, items)
}

func GetWorkItemDetails(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	entries, err := repository.GetWorkItemEntries(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, entries)
}
