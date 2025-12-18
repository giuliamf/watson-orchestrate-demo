package db2

import "os"

type Config struct {
	APIKey     string
	APIURL     string
	InstanceID string
}

func LoadConfig() Config {
	return Config{
		APIKey:     os.Getenv("IBM_API_KEY"),
		APIURL:     os.Getenv("DB2_API_URL"),
		InstanceID: os.Getenv("DB2_INSTANCE_ID"),
	}
}
