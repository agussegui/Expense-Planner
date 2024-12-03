import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ControlPresupuesto = ({
  gastos,
  setGastos,
  presupuesto,
  setPresupuesto,
  setIsValidPresupuesto,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [porcentaje, setPorcentaje] = useState(0);
  const [disponible, setDisponible] = useState(0);
  const [gastado, setGastado] = useState(0);

  useEffect(() => {
    const totalGastado = gastos.reduce(
      (total, gasto) => gasto.cantidad + total,
      0
    );

    const totalDisponible = presupuesto - totalGastado;

    // Calcular el porcentaje gastado
    const nuevoPorcentaje = (
      ((presupuesto - totalDisponible) / presupuesto) *
      100
    ).toFixed(2);

    setDisponible(totalDisponible);
    setGastado(totalGastado);
    setTimeout(() => {
      setPorcentaje(nuevoPorcentaje);
    }, 1500);
  }, [gastos]);

  const formatearCantidad = (cantidad) => {
    return cantidad.toLocaleString("en-AR", {
      style: "currency",
      currency: "ARG",
    });
  };

  const handleResetApp = () => {
    setMostrarModal(true);
  };

  const confirmarReset = () => {
    setGastos([]);
    setPresupuesto(0);
    setIsValidPresupuesto(false);
    setMostrarModal(false); // Cierra el modal
  };

  const cancelarReset = () => {
    setMostrarModal(false); // Solo cierra el modal
  };

  return (
    <div className="contenedor-presupuesto contenedor sombra dos-columnas">
      <div>
        <CircularProgressbar
          styles={buildStyles({
            pathColor: porcentaje > 100 ? "#DC2626" : "#3B82F6",
            trailColor: "#F5F5F5",
            textColor: porcentaje > 100 ? "#DC2626" : "#0A306E",
          })}
          value={porcentaje}
          text={`${porcentaje}% Gastado`}
        />
      </div>
      <div className="contenido-presupuesto">
        <button
          className="reset-app"
          type="button"
          onClick={handleResetApp}
        >
          Resetear App
        </button>

        {mostrarModal && (
          <div
            className="modal show"
            style={{
              display: "block", 
              backdropFilter: "blur(5px)", // Fondo transparente
              transition: "opacity 0.5s ease", // Transición suave
              opacity: 1,
            }}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog d-flex ">
              <div className="modal-content"  style={{backgroundColor: "white"}}>
                <div className="modal-header">
                  <h2 className="modal-title fs-5" id="exampleModalLabel">
                    ¿Deseas reiniciar presupuesto y gastos?
                  </h2>
                </div>
                <h3 className="modal-body">
                  ¿Estás seguro de que deseas resetear todos los datos?
                </h3>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="boton-cancel-app "
                    onClick={cancelarReset}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="boton-confirm-app"
                    onClick={confirmarReset}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <p>
          <span>Presupuesto:</span> {formatearCantidad(presupuesto)}
        </p>

        <p className={`${disponible < 0 ? "negativo" : ""}`}>
          <span>Disponible:</span> {formatearCantidad(disponible)}
        </p>

        <p>
          <span>Gastado:</span> {formatearCantidad(gastado)}
        </p>
      </div>
    </div>
  );
};

export default ControlPresupuesto;
