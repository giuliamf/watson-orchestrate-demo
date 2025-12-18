package db2

type queryRequest struct {
	Commands    string `json:"commands"`
	Limit       int    `json:"limit"`
	Separator   string `json:"separator"`
	StopOnError string `json:"stop_on_error"`
}

type queryResponse[T any] struct {
	Results []T `json:"results"`
}

func Query[T any](sql string) ([]T, error) {
	client := NewClient()

	req := queryRequest{
		Commands:    sql,
		Limit:       1000,
		Separator:   ";",
		StopOnError: "no",
	}

	var resp queryResponse[T]
	err := client.doRequest(req, &resp)
	return resp.Results, err
}
