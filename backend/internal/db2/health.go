package db2

import (
	"context"
	"time"
)

func HealthCheck() error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	client := NewClient()

	payload := map[string]any{
		"sql": "VALUES 1",
	}

	var resp map[string]any

	return client.doRequestWithContext(ctx, payload, &resp)
}
