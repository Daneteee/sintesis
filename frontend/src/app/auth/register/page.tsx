"use client";
import { useState } from "react";
import Alert from "../../../components/Alert";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [validations, setValidations] = useState({
    length: false,
    letter: false,
    number: false,
    special: false,
  });

  const [alert, setAlert] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Solo permite números en el teléfono
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setValidations({
        length: value.length >= 8,
        letter: /[a-zA-Z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAlert({ type: "success", message: "¡Tu registro se ha completado con éxito!" });
      } else {
        setAlert({ type: "error", message: data.msg || "Hubo un problema con el registro." });
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setAlert({ type: "error", message: "Error de conexión con el servidor." });
    }
  };
  

  return (
    <div className="flex h-[90vh] items-center justify-center transition-all duration-300 bg-base-200">
      <div className="card w-[28rem] bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl text-center">Registrate! :)</h2>

          {/* Alertas */}
          {alert && <Alert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-lg font-semibold">Nombre</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full text-lg p-3"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold">Correo electrónico</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full text-lg p-3"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold">Contraseña</label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full text-lg p-3"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {/* Reglas de validación de contraseña */}
              <div className="text-sm mt-0.5">
                {[
                  { label: "Mínimo 8 caracteres", valid: validations.length },
                  { label: "Al menos 1 letra", valid: validations.letter },
                  { label: "Al menos 1 número", valid: validations.number },
                  { label: "Al menos 1 carácter especial", valid: validations.special },
                ].map(({ label, valid }, index) => (
                  <div key={index} className={`flex items-center gap-2 ${valid ? "text-green-500" : "text-red-500"}`}>
                    {valid ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17l-4.17-4.17-1.41 1.41L9 19 21.59 6.41 20.17 5z" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95 1.414-1.414z" />
                      </svg>
                    )}
                    {label}
                  </div>
                ))}
              </div>
            </div>            

            <div>
              <label className="block text-lg font-semibold">Teléfono</label>
              <input
                type="text"
                name="phone"
                className="input input-bordered w-full text-lg p-3"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full">
              Registrarse
            </button>
          </form>
          <p className="text-md text-center mt-3">
            ¿Ya tienes cuenta? <a href="/auth/login" className="link">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>

  );
}
