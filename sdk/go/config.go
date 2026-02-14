package msb

type ReqIdProducer func() string

type config struct {
	serverUrl string
	name      string
	apiKey    string
	logger    Logger
	reqIDPrd  ReqIdProducer
}

const (
	defaultServerUrl    = "http://127.0.0.1:5555"
	defaultNameTemplate = "sandbox-%08x" // 8-char hex value (0-padded if shorter)
)
