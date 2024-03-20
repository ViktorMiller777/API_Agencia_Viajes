import axios from 'axios';

export default class CopomexResource {
    public static async codigo(codigoPostal){
        // const token = "2c14fde6-aa1d-4fb0-bc60-f5d1edb15a65"
        const res = await axios.get(`https://api.copomex.com/query/info_cp/${codigoPostal}?token=pruebas`)
        // const res = await axios.get(`https://api.copomex.com/query/info_cp/${codigoPostal}?token=${token}`)
        return res.data
    }
}
