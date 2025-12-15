# ETAPA 1: Imagem base leve com Go
FROM golang:1.25-alpine

# Instala dependências básicas do sistema (necessário para alguns pacotes)
RUN apk add --no-cache git build-base

# Define pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependência do Go
COPY go.mod go.sum ./
RUN go mod download

# Copia todo o código fonte (incluindo a pasta dist do frontend)
COPY . .

# Compila o executável chamado "server"
RUN go build -o server .

# Expõe a porta 8080 (que usamos no código)
EXPOSE 8080

# Comando para rodar o app
CMD ["./server"]