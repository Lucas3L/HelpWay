const API_BASE_URL = 'https://helpway-api.onrender.com'; // Ou seu IP local

export const api = {

  async login(email: string, senha: string) {
    const response = await fetch(`${API_BASE_URL}/usuario/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    if (!response.ok) {
      throw new Error('Email ou senha incorretos');
    }
    return response.json();
  },

  async createUser(data: any) {
    const response = await fetch(`${API_BASE_URL}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao criar usuário');
    }
    return response.json();
  },

  async updateUser(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/usuario/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao atualizar usuário');
    }
    return response.json();
  },

  async getUserById(id: string) {
    const res = await fetch(`${API_BASE_URL}/usuario/${id}`);
    if (!res.ok) throw new Error('Usuário não encontrado');
    return res.json();
  },

  async getUserByEmail(email: string) {
    // Esta rota está no seu Swagger, é /usuario/{id}
    // Mas o fluxo do Google Login precisa disto. Se o seu backend 
    // não tem /usuario/email/{email}, o login do Google falhará.
    const res = await fetch(`${API_BASE_URL}/usuario/email/${email}`);
    if (!res.ok) throw new Error('Usuário não encontrado');
    return res.json();
  },

  async criarCampanha(data: any) {
    const response = await fetch(`${API_BASE_URL}/campanha`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao criar campanha');
    }
    return response.json();
  },

  async getCampanhas() {
    const response = await fetch(`${API_BASE_URL}/campanha`);
    if (!response.ok) {
      throw new Error('Erro ao buscar campanhas');
    }
    return response.json();
  },

  async getCampanhaById(id: number) {
    const response = await fetch(`${API_BASE_URL}/campanha/${id}`);
    if (!response.ok) {
      throw new Error('Campanha não encontrada');
    }
    return response.json();
  },

  async updateCampanha(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/campanha/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao atualizar campanha');
    }
    return response.json();
  },

  async updateCampanhaLocation(id: number, locationData: any) {
    const response = await fetch(`${API_BASE_URL}/campanha/${id}/localizacao`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Erro ao atualizar localização');
    }
    return response.json();
  },

  async getCampanhasByUserId(userId: number) {
    const res = await fetch(`${API_BASE_URL}/usuario/${userId}/campanhas`);
    if (!res.ok) throw new Error('Erro ao buscar campanhas do usuário');
    return res.json();
  },

  async getDoacoesFeitasByUserId(userId: number) {
    const res = await fetch(`${API_BASE_URL}/usuario/${userId}/doacoes`);
    if (!res.ok) throw new Error('Erro ao buscar histórico de doações feitas');
    return res.json();
  },

  // ESTA É A FUNÇÃO QUE ESTAVA FALTANDO
  async getDoacoesRecebidasByUserId(userId: number) {
    // O seu Swagger não tem esta rota.
    // O frontend está chamando isso, mas a API não tem.
    // O APLICATIVO VAI DAR O 'Alert' de erro até que o backend implemente esta rota.
    console.warn(`API NÃO IMPLEMENTADA: getDoacoesRecebidasByUserId (GET /usuario/${userId}/doacoes-recebidas)`);
    const res = await fetch(`${API_BASE_URL}/usuario/${userId}/doacoes-recebidas`);
    if (!res.ok) throw new Error('O Backend (API) não implementou a rota /usuario/{id}/doacoes-recebidas');
    return res.json();
  },

  // ESTA É A FUNÇÃO QUE O FLUXO NOVO (ORGANIZADOR) USA
  async getDoacoesRecebidasByCampaignId(campaignId: string) {
    // O seu Swagger também não tem esta rota.
    // O APLICATIVO VAI DAR O 'Alert' de erro até que o backend implemente esta rota.
    console.warn(`API NÃO IMPLEMENTADA: getDoacoesRecebidasByCampaignId (GET /campanha/${campaignId}/doacoes-recebidas)`);
    const res = await fetch(`${API_BASE_URL}/campanha/${campaignId}/doacoes-recebidas`);
    if (!res.ok) throw new Error('O Backend (API) não implementou a rota /campanha/{id}/doacoes-recebidas');
    return res.json();
  },

  async registrarDoacao(data: any) {
    const response = await fetch(`${API_BASE_URL}/doacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erro ao registrar doação');
    }
    return response.json();
  },
};