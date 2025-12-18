package db2

import (
	"bytes"
	"encoding/json"
	"net/http"
	"sync"
	"time"
)

var (
	token     string
	expiresAt time.Time
	mu        sync.Mutex
)

func getIAMToken(apiKey string) (string, error) {
	mu.Lock()
	defer mu.Unlock()

	if time.Now().Before(expiresAt) && token != "" {
		return token, nil
	}

	body := "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + apiKey

	req, _ := http.NewRequest(
		"POST",
		"https://iam.cloud.ibm.com/identity/token",
		bytes.NewBufferString(body),
	)

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var data struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return "", err
	}

	token = data.AccessToken
	expiresAt = time.Now().Add(time.Duration(data.ExpiresIn-60) * time.Second)

	return token, nil
}
