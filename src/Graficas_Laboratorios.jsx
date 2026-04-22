import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import './Graficas_Laboratorios.css'; 

function GraficaLaboratorios({ usuario, regresar }) {
    const [datos, setDatos] = useState([]);
    const [tipoGrafica, setTipoGrafica] = useState('barras');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
    fetch('http://localhost:4500/api/resultados/laboratorios')
        .then(res => res.json())
        .then(res => {
            if (res.success && Array.isArray(res.data)) {
                setDatos(res.data);
            }
            setCargando(false);
        })
        .catch(err => {
            console.error("Error:", err);
            setCargando(false);
        });
}, []);

    if (cargando) return <div className="cargando">Verificando estado de los laboratorios...</div>;
    
    if (datos.length === 0) return (
    <div className="pantalla-login" style={{ background: '#6C1D45', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="titulo-serif-grande" style={{ color: 'white', textAlign: 'center' }}>
            No hay evaluaciones de <br /> laboratorios todavía.
        </h1>
        <button className="role-btn" onClick={regresar} style={{ marginTop: '30px', color: 'white', borderColor: 'white' }}>
            ⬅ Regresar
        </button>
    </div>
);

    const COLORS = ['#b38e5d', '#d4af37', '#852152', '#4a1030'];

    return (
        <div className="pantalla-login" style={{ overflowY: 'auto', padding: '20px', background: '#6C1D45' }}>
            <div className="lado-izq" style={{ width: '100%' }}>
                <h1 className="titulo-serif">Rendimiento de Laboratorios</h1>
                <div className="linea-dorada"></div>

                <div className="selector-graficas">
                    <button className="role-btn" onClick={() => setTipoGrafica('barras')}>Barras</button>
                    <button className="role-btn" onClick={() => setTipoGrafica('pastel')}>Pastel</button>
                    <button className="role-btn" onClick={() => setTipoGrafica('radar')}>Radar Técnico</button>
                </div>

                <div className="contenedor-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        {tipoGrafica === 'barras' ? (
                            <BarChart data={datos}>
                                <XAxis dataKey="pregunta" hide />
                                <YAxis stroke="white" />
                                <Tooltip contentStyle={{ background: '#6C1D45', border: '1px solid #b38e5d' }} />
                                <Bar dataKey="porcentaje" fill="#b38e5d" />
                            </BarChart>
                        ) : tipoGrafica === 'pastel' ? (
                            <PieChart>
                                <Pie data={datos} dataKey="porcentaje" nameKey="pregunta" cx="50%" cy="50%" outerRadius={80} label>
                                    {datos.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        ) : (
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={datos}>
                                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                                <PolarAngleAxis dataKey="pregunta" tick={{ fill: 'white', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Laboratorio" dataKey="porcentaje" stroke="#b38e5d" fill="#b38e5d" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <table className="tabla-resultados">
                    <thead>
                        <tr>
                            <th>Recurso Tecnológico</th>
                            <th>Funcionalidad (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key={index}>
                                <td>{item.pregunta}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className="barra-progreso-bg">
                                        <div className="barra-progreso-fill" style={{ width: `${item.porcentaje}%` }}></div>
                                        <span className="texto-porcentaje">{item.porcentaje}%</span>
                                    </div>
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

export default GraficaLaboratorios;