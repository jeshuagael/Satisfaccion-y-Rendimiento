import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';
import './Grafica_Salones.css'; 

function GraficaSalones({ usuario, regresar }) {
    const [datos, setDatos] = useState([]);
    const [tipoGrafica, setTipoGrafica] = useState('barras');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4500/api/resultados/salones')
            .then(res => res.json())
            .then(res => {
                if (res.success) setDatos(res.data);
                setCargando(false);
            })
            .catch(err => console.error("Error cargando estadísticas de salones:", err));
    }, []);

    if (cargando) return <div className="cargando">Cargando datos de infraestructura...</div>;
    
    if (datos.length === 0) return (
        <div className="pantalla-login" style={{ background: '#6C1D45' }}>
            <h1 className="titulo-serif-grande" style={{ color: 'white', textAlign: 'center' }}>
                No hay reportes de <br /> salones todavía.
            </h1>
            <button className="role-btn" onClick={regresar} style={{ marginTop: '900px', color: 'black', borderColor: 'white' }}>
                ⬅ Regresar
            </button>
        </div>
    );

    const COLORS = ['#b38e5d', '#852152', '#d4af37', '#4a1030'];

    return (
        <div className="pantalla-login" style={{ overflowY: 'auto', padding: '20px', background: '#6C1D45' }}>
            <div className="lado-izq" style={{ width: '100%' }}>
                <h1 className="titulo-serif">Infraestructura de Salones</h1>
                <div className="linea-dorada"></div>

                <div className="selector-graficas">
                    <button className="role-btn" onClick={() => setTipoGrafica('barras')}>Barras</button>
                    <button className="role-btn" onClick={() => setTipoGrafica('pastel')}>Distribución</button>
                    <button className="role-btn" onClick={() => setTipoGrafica('area')}>Área</button>
                </div>

                <div className="contenedor-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        {tipoGrafica === 'barras' ? (
                            <BarChart data={datos}>
                                <XAxis dataKey="pregunta" hide />
                                <YAxis stroke="white" />
                                <Tooltip contentStyle={{ borderRadius: '10px' }} />
                                <Bar dataKey="porcentaje" fill="#b38e5d" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        ) : tipoGrafica === 'pastel' ? (
                            <PieChart>
                                <Pie data={datos} dataKey="porcentaje" nameKey="pregunta" cx="50%" cy="50%" outerRadius={80} label>
                                    {datos.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        ) : (
                            <AreaChart data={datos}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="pregunta" hide />
                                <YAxis stroke="white" />
                                <Tooltip />
                                <Area type="monotone" dataKey="porcentaje" stroke="#b38e5d" fill="#b38e5d" fillOpacity={0.3} />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <table className="tabla-resultados">
                    <thead>
                        <tr>
                            <th>Mobiliario e Instalaciones</th>
                            <th>Estado (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key={index}>
                                <td>{item.pregunta}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className="badge-porcentaje">{item.porcentaje}%</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="role-btn" onClick={regresar} style={{ marginTop: '30px', color: 'black', borderColor: 'white' }}>
                    ⬅ Volver al Panel
                </button>
            </div>
            <div className="VersionTag">v1.4.1</div>
        </div>
    );
}

export default GraficaSalones;