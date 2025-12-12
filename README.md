# 🚛 LogiTrack - Sistema de Gestão de Frotas em Tempo Real

![LogiTrack](https://img.shields.io/badge/LogiTrack-Fleet%20Management-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4.5.0-47A248?style=for-the-badge&logo=mongodb)

Uma plataforma SaaS B2B completa para roteirização e telemetria de frotas em tempo real, desenvolvida com React, FastAPI e MongoDB.

## 🎯 **Visão Geral**

O LogiTrack é um sistema profissional de gestão de frotas que oferece monitoramento em tempo real, telemetria avançada e alertas inteligentes para empresas de logística e transporte. 

### ✨ **Funcionalidades Principais**

- 📊 **Dashboard Executivo** - KPIs e métricas em tempo real
- 🗺️ **Mapa Interativo** - Visualização da frota com OpenStreetMap
- 🚨 **Sistema de Alertas** - Notificações automáticas para situações críticas
- 📈 **Telemetria Avançada** - Monitoramento de velocidade, combustível e localização
- 🔄 **Tempo Real** - Atualizações automáticas via WebSocket
- 📱 **Interface Responsiva** - Funciona em desktop, tablet e mobile

## 🛠️ **Tecnologias Utilizadas**

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Python-SocketIO** - Comunicação em tempo real
- **MongoDB** - Banco de dados NoSQL
- **Motor** - Driver MongoDB assíncrono
- **Pydantic** - Validação e serialização de dados

### Frontend
- **React 19** - Biblioteca para interfaces de usuário
- **Leaflet** - Mapas interativos com OpenStreetMap
- **Socket.IO Client** - Comunicação em tempo real
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos

## 🚀 **Como Executar**

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd logitrack
```

2. **Configure o Backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure o Frontend**
```bash
cd frontend
yarn install
```

4. **Configure as variáveis de ambiente**

Backend (`.env`):
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=logitrack_db
CORS_ORIGINS=*
```

Frontend (`.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

5. **Execute o projeto**

Backend:
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Frontend:
```bash
cd frontend
yarn start
```

## 📁 **Estrutura do Projeto**

```
logitrack/
├── backend/
│   ├── server.py              # Aplicação FastAPI principal
│   ├── requirements.txt       # Dependências Python
│   └── .env                  # Variáveis de ambiente
├── frontend/
│   ├── src/
│   │   ├── App.js            # Componente principal React
│   │   ├── App.css           # Estilos principais
│   │   └── components/ui/    # Componentes Shadcn/UI
│   ├── package.json          # Dependências Node.js
│   └── .env                  # Variáveis de ambiente
└── README.md
```

## 🔌 **API Endpoints**

### Veículos
- `GET /api/vehicles` - Lista todos os veículos
- `POST /api/vehicles` - Cria um novo veículo
- `GET /api/fleet/stats` - Estatísticas da frota

### Alertas
- `GET /api/alerts` - Lista alertas por severidade
- `GET /api/alerts?limit=10` - Limita quantidade de alertas

### Rotas
- `GET /api/routes` - Lista todas as rotas
- `POST /api/routes` - Cria uma nova rota

### WebSocket Events
- `fleet_update` - Atualizações em tempo real da frota
- `connect` - Conexão estabelecida
- `disconnect` - Conexão encerrada

## 📊 **Funcionalidades Detalhadas**

### Dashboard Executivo
- **KPIs em Tempo Real**: Total de veículos, veículos ativos, combustível médio, alertas
- **Alertas Recentes**: Lista dos últimos alertas com severidade e timestamp
- **Métricas Dinâmicas**: Dados atualizados automaticamente

### Mapa da Frota
- **Visualização em Tempo Real**: Posição atual de todos os veículos
- **Marcadores Coloridos**: 
  - 🟢 Verde = Ativo
  - 🟡 Amarelo = Parado  
  - 🔴 Vermelho = Manutenção
- **Popups Informativos**: Detalhes completos ao clicar no veículo
- **Controles de Zoom**: Navegação intuitiva pelo mapa

### Sistema de Alertas
- **Alertas Automáticos**:
  - Excesso de velocidade (>80 km/h)
  - Combustível baixo (<20%)
  - Combustível crítico (<5%)
- **Níveis de Severidade**: Low, Medium, High, Critical
- **Notificações Visuais**: Badge no sino com contador de alertas

### Simulação de Frota
O sistema inclui um simulador que gera:
- 7 veículos operando na Grande São Paulo
- Movimento automático a cada 30 segundos
- Mudanças realistas de velocidade e combustível
- Geração automática de alertas baseada em condições

## 🎨 **Design System**

### Paleta de Cores
- **Primária**: Azul tecnológico (`#3b82f6`)
- **Secundária**: Tons neutros (cinza, branco)
- **Status**: Verde (ativo), Amarelo (parado), Vermelho (crítico)

### Tipografia
- **Fonte**: Inter - Para legibilidade profissional
- **Hierarquia**: Títulos, subtítulos e texto corpo bem definidos

### Componentes
- **Shadcn/UI**: Biblioteca de componentes moderna e acessível
- **Lucide React**: Ícones consistentes e modernos
- **Tailwind CSS**: Estilização utilitária e responsiva

## 🔧 **Arquitetura Técnica**

### Backend Architecture
```
FastAPI Application
├── WebSocket Handler (Socket.IO)
├── REST API Routes
├── MongoDB Integration
├── Vehicle Simulation Engine
└── Alert Generation System
```

### Frontend Architecture
```
React Application
├── Dashboard Component
├── Fleet Map Component
├── Alerts Component
├── WebSocket Client
└── API Integration Layer
```

### Data Models

**Vehicle**:
```json
{
  "id": "uuid",
  "name": "Truck SP-001",
  "driver_name": "João Silva",
  "lat": -23.5505,
  "lng": -46.6333,
  "speed": 45.2,
  "fuel_level": 78.5,
  "status": "active",
  "odometer": 125000.5,
  "engine_hours": 3500.2,
  "last_updated": "2025-09-13T16:30:00Z"
}
```

**Alert**:
```json
{
  "id": "uuid",
  "vehicle_id": "vehicle-uuid",
  "type": "speed",
  "message": "Van SP-004 excedendo velocidade: 88.4 km/h",
  "severity": "high",
  "timestamp": "2025-09-13T16:30:00Z",
  "resolved": false
}
```

## 📱 **Demonstração**

### Screenshots

**Dashboard Executivo**
- KPIs atualizados em tempo real
- Alertas recentes com severidade
- Interface limpa e profissional

**Mapa da Frota**
- Veículos posicionados em São Paulo
- Marcadores coloridos por status
- Popups com informações detalhadas

**Central de Alertas**
- Lista completa de alertas
- Filtros por severidade e timestamp
- Interface intuitiva para gerenciamento

## 🚀 **Deploy e Produção**

### Variáveis de Ambiente Necessárias

**Backend**:
```env
MONGO_URL=mongodb://production-url:27017
DB_NAME=logitrack_prod
CORS_ORIGINS=https://yourapp.com
```

**Frontend**:
```env
REACT_APP_BACKEND_URL=https://api.yourapp.com
```

### Docker Support

```dockerfile
# Dockerfile exemplo para o backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines de Desenvolvimento

- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Mantenha a documentação atualizada
- Use commits semânticos

## 📋 **Roadmap**

### v1.1 - Próximas Funcionalidades
- [ ] Algoritmos de otimização de rotas (Google OR-Tools)
- [ ] Integração com APIs de terceiros (Geotab, Samsara)
- [ ] Relatórios avançados e exportação
- [ ] Notificações push e email
- [ ] Gestão de usuários e permissões

### v1.2 - Funcionalidades Avançadas
- [ ] Manutenção preditiva com IA
- [ ] Integração com ERPs
- [ ] Dashboard customizável (drag-and-drop)
- [ ] API pública para integrações
- [ ] Aplicativo mobile

## 📞 **Suporte**

Para suporte técnico ou dúvidas:
- 📧 Email: gabrielmoraesbastos2112@gmail.com

## 📄 **Licença**

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

---

**Desenvolvido com ❤️ para revolucionar a gestão de frotas no Brasil**

![LogiTrack Banner](https://via.placeholder.com/800x200/3b82f6/ffffff?text=LogiTrack+-+Fleet+Management+Platform)
