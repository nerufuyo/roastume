// Package configuration provides professional configuration functionality
// with comprehensive error handling, logging, and configuration management
// following Go best practices and idiomatic patterns.
//
// Author: Automation System
// Version: 1.0.0
// Created: 2025-07-04T11:23:06.692476
package configuration

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"
)

// Status represents the current state of configuration operations
type Status int

const (
	// StatusPending indicates operation is pending
	StatusPending Status = iota
	// StatusProcessing indicates operation is in progress
	StatusProcessing
	// StatusCompleted indicates operation completed successfully
	StatusCompleted
	// StatusFailed indicates operation failed
	StatusFailed
)

// String returns string representation of Status
func (s Status) String() string {
	switch s {
	case StatusPending:
		return "pending"
	case StatusProcessing:
		return "processing"
	case StatusCompleted:
		return "completed"
	case StatusFailed:
		return "failed"
	default:
		return "unknown"
	}
}

// Config holds configuration settings for configuration operations
type Config struct {
	Enabled   bool          `json:"enabled"`
	Timeout   time.Duration `json:"timeout"`
	Retries   int           `json:"retries"`
	LogLevel  string        `json:"log_level"`
}

// DefaultConfig returns a default configuration
func DefaultConfig() *Config {
	return &Config{
		Enabled:  true,
		Timeout:  30 * time.Second,
		Retries:  3,
		LogLevel: "INFO",
	}
}

// Result represents the result of a configuration operation
type Result struct {
	Status        string    `json:"status"`
	ProcessedAt   time.Time `json:"processed_at"`
	DataSize      int       `json:"data_size"`
	ProcessingTime time.Duration `json:"processing_time"`
	Message       string    `json:"message,omitempty"`
}

// Manager provides professional configuration management functionality
type Manager struct {
	config    *Config
	status    Status
	mu        sync.RWMutex
	createdAt time.Time
	logger    *log.Logger
}

// ManagerInterface defines the interface for configuration operations
type ManagerInterface interface {
	Process(ctx context.Context, data interface{}) (*Result, error)
	ProcessAsync(ctx context.Context, data interface{}) <-chan *Result
	Validate(data interface{}) error
	GetStatus() Status
	Reset()
	Close() error
}

// NewManager creates a new configuration manager instance
func NewManager(config *Config) *Manager {
	if config == nil {
		config = DefaultConfig()
	}
	
	manager := &Manager{
		config:    config,
		status:    StatusPending,
		createdAt: time.Now(),
		logger:    log.New(log.Writer(), fmt.Sprintf("[CONFIGURATION] "), log.LstdFlags),
	}
	
	manager.setupLogging()
	return manager
}

// setupLogging configures logging for the manager
func (m *Manager) setupLogging() {
	m.logger.Printf("Initialized configuration manager with configuration")
}

// Process executes configuration processing with comprehensive error handling
func (m *Manager) Process(ctx context.Context, data interface{}) (*Result, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	
	start := time.Now()
	
	m.logger.Printf("Starting configuration processing")
	m.status = StatusProcessing
	
	// Validate input data
	if err := m.Validate(data); err != nil {
		m.status = StatusFailed
		m.logger.Printf("Configuration processing failed: %v", err)
		return nil, fmt.Errorf("validation failed: %w", err)
	}
	
	// Execute processing with context cancellation support
	result, err := m.executeProcessing(ctx, data)
	if err != nil {
		m.status = StatusFailed
		m.logger.Printf("Configuration processing failed: %v", err)
		return nil, fmt.Errorf("processing failed: %w", err)
	}
	
	result.ProcessingTime = time.Since(start)
	m.status = StatusCompleted
	m.logger.Printf("Configuration processing completed successfully")
	
	return result, nil
}

// ProcessAsync executes configuration processing asynchronously
func (m *Manager) ProcessAsync(ctx context.Context, data interface{}) <-chan *Result {
	resultChan := make(chan *Result, 1)
	
	go func() {
		defer close(resultChan)
		
		result, err := m.Process(ctx, data)
		if err != nil {
			result = &Result{
				Status:  "error",
				Message: err.Error(),
			}
		}
		
		select {
		case resultChan <- result:
		case <-ctx.Done():
			return
		}
	}()
	
	return resultChan
}

// Validate validates input data according to business rules
func (m *Manager) Validate(data interface{}) error {
	if data == nil {
		m.logger.Printf("Validation failed: data is nil")
		return fmt.Errorf("data cannot be nil")
	}
	
	m.logger.Printf("Data validation passed")
	return nil
}

// executeProcessing performs the core processing logic
func (m *Manager) executeProcessing(ctx context.Context, data interface{}) (*Result, error) {
	// Simulate processing with context cancellation support
	select {
	case <-time.After(100 * time.Millisecond):
		// Processing completed
	case <-ctx.Done():
		return nil, ctx.Err()
	}
	
	dataStr := fmt.Sprintf("%v", data)
	
	result := &Result{
		Status:      "success",
		ProcessedAt: time.Now(),
		DataSize:    len(dataStr),
		Message:     "Configuration processing completed successfully",
	}
	
	return result, nil
}

// GetStatus returns the current processing status
func (m *Manager) GetStatus() Status {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.status
}

// Reset resets the manager to initial state
func (m *Manager) Reset() {
	m.mu.Lock()
	defer m.mu.Unlock()
	
	m.status = StatusPending
	m.logger.Printf("Configuration manager reset completed")
}

// GetConfig returns the current configuration
func (m *Manager) GetConfig() *Config {
	return m.config
}

// GetCreatedAt returns the creation timestamp
func (m *Manager) GetCreatedAt() time.Time {
	return m.createdAt
}

// Close performs cleanup operations
func (m *Manager) Close() error {
	m.mu.Lock()
	defer m.mu.Unlock()
	
	m.logger.Printf("Configuration manager closing")
	return nil
}

// Factory function to create configuration manager with default configuration
func CreateConfigurationManager() *Manager {
	return NewManager(DefaultConfig())
}

// Factory function to create configuration manager with custom configuration
func CreateConfigurationManagerWithConfig(config *Config) *Manager {
	return NewManager(config)
}
