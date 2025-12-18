package main

import (
	"log"
	"os"
	"sgh-backend/internal/router"

	"github.com/joho/godotenv"
)

func main() {
	// Try loading from root or internal config
	if err := godotenv.Load(); err != nil {
		if err := godotenv.Load("internal/config/.env"); err != nil {
			log.Println("No .env file found")
		}
	}
	
	// Ensure DB2 config is present
	if os.Getenv("IBM_API_KEY") == "" {
		log.Println("Warning: IBM_API_KEY is not set")
	}

	r := router.Setup()
	log.Fatal(r.Run(":8080"))
}
