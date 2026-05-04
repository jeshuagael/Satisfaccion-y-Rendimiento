import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import './Grafica_Docente.css'; 

function GraficaBano({ usuario, regresar }) {
    const [datos, setDatos] = useState([]);
    const [tipoGrafica, setTipoGrafica] = useState('barras');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Pedimos los datos de baño al server Para todos los archivos de grafica es lo mismo
        fetch('http://localhost:4500/api/resultados/bano')
            .then(res => res.json())
            .then(res => {
                if (res.success) setDatos(res.data);
                setCargando(false);
            })
            .catch(err => console.error("Error cargando estadísticas docentes:", err));
    }, []);

    if (cargando) return <div className="cargando">Analizando desempeño académico...</div>;
    
    if (datos.length === 0) return (
        <div className="pantalla-login" style={{ background: '#6C1D45' }}>
            <h1 className="titulo-serif-grande" style={{ color: 'white', textAlign: 'center' }}>
                No hay evaluaciones <br /> docentes todavía.
            </h1>
            <button className="role-btn" onClick={regresar} style={{ marginTop: '20px', color: 'white', borderColor: 'white' }}>
                ⬅ Regresar
            </button>
        </div>
    );

    const COLORS = ['#b38e5d', '#d4af37', '#e5c05b', '#f9e076'];

    return (
        <div className="pantalla-login" style={{ overflowY: 'auto', padding: '20px', background: '#6C1D45' }}>
            <div className="lado-izq" style={{ width: '100%' }}>
                <h1 className="titulo-serif">Estadísticas Académicas</h1>
                <div className="linea-dorada"></div>

                <div className="selector-graficas">
                    <button className="role-btn" onClick={() => setTipoGrafica('barras')}>Barras</button>
                    <button className="role-btn" onClick={() => setTipoGrafica('pastel')}>Pastel</button>
                    <button className="role-btn" onClick={() => setTipoGrafica('lineas')}>Tendencia</button>
                </div>
                {/* grafica de contenedor*/}
                <div className="contenedor-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        {tipoGrafica === 'barras' ? (
                            <BarChart data={datos}>
                                <XAxis dataKey="pregunta" stroke="white" hide />
                                <YAxis stroke="white" />
                                <Tooltip contentStyle={{ backgroundColor: '#6C1D45', border: '1px solid #b38e5d' }} />
                                <Bar dataKey="porcentaje" fill="#b38e5d" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        ) : tipoGrafica === 'pastel' ? ( 
                            <PieChart> {/* grafica pastel */}
                                <Pie data={datos} dataKey="porcentaje" nameKey="pregunta" cx="50%" cy="50%" outerRadius={80} label>
                                    {datos.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        ) : (
                            <LineChart data={datos}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="pregunta" hide />
                                <YAxis stroke="white" />
                                <Tooltip />
                                <Line type="monotone" dataKey="porcentaje" stroke="#b38e5d" strokeWidth={3} dot={{ fill: '#b38e5d' }} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <table className="tabla-resultados">
                    <thead>
                        <tr>
                            <th>Indicador de Desempeño</th>
                            <th>Satisfacción Alumnado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((item, index) => (
                            <tr key={index}>
                                <td>{item.pregunta}</td>
                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{item.porcentaje}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="role-btn" onClick={regresar} style={{ marginTop: '30px', color: 'black', borderColor: 'white' }}>
                    ⬅ Volver al Panel
                </button>
            </div>
          
        </div>
    );
}

export default GraficaBano;