class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getAnnotations() {
    const response = await fetch(`${this.baseURL}/annotations`);
    return response.json();
  }

  async createAnnotation(annotation) {
    const response = await fetch(`${this.baseURL}/annotations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annotation),
    });
    return response.json();
  }

  async getAnnotationById(id) {
    const response = await fetch(`${this.baseURL}/annotations/${id}`);
    return response.json();
  }

  async updateAnnotation(id, annotation) {
    const response = await fetch(`${this.baseURL}/annotations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(annotation),
    });
    return response.json();
  }

  async deleteAnnotation(id) {
    const response = await fetch(`${this.baseURL}/annotations/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }
}

const apiService = new ApiService('https://kyungwan.com/api');
export default apiService;
