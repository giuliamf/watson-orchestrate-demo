package models

type Contract struct {
	ID             int     `json:"id"`
	RateBusiness   float64 `json:"rate_business"`
	RateSunHoliday float64 `json:"rate_sun_holiday"`
	RateSatDay     float64 `json:"rate_sat_day"`
	RateEvening    float64 `json:"rate_evening"`
	RateNight      float64 `json:"rate_night"`
}
