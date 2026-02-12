package main

import (
	"sgh-backend/models"
	"time"
)

func getMultiplierForTime(t time.Time, c models.Contract) float64 {
	hour := t.Hour()
	weekday := t.Weekday()
	if weekday == time.Sunday {
		return c.RateSunHoliday
	}
	if weekday == time.Saturday {
		if hour >= 9 && hour < 18 {
			return c.RateSatDay
		}
		if hour >= 18 {
			return c.RateSatNight
		}
		return c.RateNight
	}
	if hour >= 9 && hour < 18 {
		return c.RateBusiness
	}
	if hour >= 18 && hour < 22 {
		return c.RateEvening
	}
	return c.RateNight
}

func calculateBillable(date time.Time, startStr, endStr string, manualHours float64, contract models.Contract) (float64, float64) {
	startInfo, _ := time.Parse("15:04", startStr)
	endInfo, _ := time.Parse("15:04", endStr)
	start := time.Date(date.Year(), date.Month(), date.Day(), startInfo.Hour(), startInfo.Minute(), 0, 0, date.Location())
	end := time.Date(date.Year(), date.Month(), date.Day(), endInfo.Hour(), endInfo.Minute(), 0, 0, date.Location())
	if end.Before(start) {
		end = end.Add(24 * time.Hour)
	}

	totalMinutes := end.Sub(start).Minutes()
	if totalMinutes <= 0 {
		return 0, 0
	}

	var sumMultipliers float64 = 0
	current := start
	for current.Before(end) {
		sumMultipliers += getMultiplierForTime(current, contract)
		current = current.Add(time.Minute)
	}
	averageRate := sumMultipliers / totalMinutes
	finalBillable := manualHours * averageRate
	return manualHours, finalBillable
}
