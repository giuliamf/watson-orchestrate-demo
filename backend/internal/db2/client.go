package db2

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

type Client struct {
	cfg Config
}

func NewClient() *Client {
	return &Client{cfg: LoadConfig()}
}

func (c *Client) doRequest(payload any, result any) error {
	token, err := getIAMToken(c.cfg.APIKey)
	if err != nil {
		return err
	}

	body, _ := json.Marshal(payload)

	req, _ := http.NewRequest(
		"POST",
		c.cfg.APIURL+"/sql_query",
		bytes.NewBuffer(body),
	)

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	if c.cfg.InstanceID != "" {
		req.Header.Set("x-deployment-id", c.cfg.InstanceID)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("db2 api error: %s", resp.Status)
	}

	return json.NewDecoder(resp.Body).Decode(result)
}

func (c *Client) doRequestWithContext(
	ctx context.Context,
	payload any,
	result any,
) error {
	token, err := getIAMToken(c.cfg.APIKey)
	if err != nil {
		return err
	}

	body, _ := json.Marshal(payload)

	req, err := http.NewRequestWithContext(
		ctx,
		"POST",
		c.cfg.APIURL+"/sql_query",
		bytes.NewBuffer(body),
	)
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	if c.cfg.InstanceID != "" {
		req.Header.Set("x-deployment-id", c.cfg.InstanceID)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("db2 api error: %s", resp.Status)
	}

	return json.NewDecoder(resp.Body).Decode(result)
}
