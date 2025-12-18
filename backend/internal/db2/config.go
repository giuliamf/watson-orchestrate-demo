package db2

import (
	"os"
	"strings"
)

type Config struct {
	APIKey     string
	APIURL     string
	Database   string
	Host       string
	InstanceID string
}

func LoadConfig() Config {
	cfg := Config{
		APIKey:     os.Getenv("IBM_API_KEY"),
		APIURL:     os.Getenv("DB2_API_URL"),
		Database:   os.Getenv("DB2_DATABASE"),
		Host:       os.Getenv("DB2_HOST"),
		InstanceID: os.Getenv("DB2_INSTANCE_ID"),
	}

	if cfg.APIURL == "" && cfg.Host != "" {
		// Strip port if present
		host := cfg.Host
		if idx := strings.Index(host, ":"); idx != -1 {
			host = host[:idx]
		}
		cfg.APIURL = "https://" + host + "/dbapi/v4"
	}

	return cfg
}
