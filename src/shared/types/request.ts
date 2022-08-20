interface ReqData {
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  auth?: boolean,
  body?: string
}

export { ReqData };