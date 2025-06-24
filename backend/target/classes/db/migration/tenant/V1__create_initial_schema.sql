-- =================================================================
-- V1: SCRIPT DE CREACIÓN DE ESQUEMA INICIAL PARA CADA INQUILINO (VERSIÓN MEJORADA)
-- Mejoras:
-- - Se añade unicidad a Producto (nombre, marca) y Cliente (dni).
-- - Se añaden campos de auditoría (created_at, updated_at).
-- - Se mejora la integridad referencial con ON DELETE.
-- =================================================================

-- Tabla de Clientes
CREATE TABLE cliente (
                         id BIGSERIAL PRIMARY KEY,
                         nombre VARCHAR(255) NOT NULL,
                         apellidos VARCHAR(255),
                         dni VARCHAR(15) UNIQUE, -- Un cliente no puede tener el mismo DNI que otro.
                         telefono VARCHAR(20),
                         direccion TEXT,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE producto (
                          id BIGSERIAL PRIMARY KEY,
                          nombre VARCHAR(255) NOT NULL,
                          marca VARCHAR(100),
                          categoria VARCHAR(100),
                          unidad VARCHAR(50),
                          precio DECIMAL(10, 2) NOT NULL,
                          stock INT NOT NULL DEFAULT 0,
                          stock_minimo INT NOT NULL DEFAULT 0,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- No puede existir el mismo producto de la misma marca dos veces.
                          CONSTRAINT producto_nombre_marca_unique UNIQUE (nombre, marca)
);

-- Tabla de Usuarios del sistema
CREATE TABLE usuario (
                         id BIGSERIAL PRIMARY KEY,
                         nombre VARCHAR(255) NOT NULL,
                         username VARCHAR(100) UNIQUE NOT NULL, -- El nombre de usuario debe ser único.
                         password VARCHAR(255) NOT NULL,
                         rol VARCHAR(50) NOT NULL,
                         is_active BOOLEAN NOT NULL DEFAULT TRUE,
                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Ventas
CREATE TABLE venta (
                       id BIGSERIAL PRIMARY KEY,
                       cliente_id BIGINT,
                       usuario_id BIGINT, -- Para saber qué usuario realizó la venta
                       fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       total DECIMAL(10, 2) NOT NULL,
                       metodo_pago VARCHAR(50),
                       estado VARCHAR(50) NOT NULL, -- Ej: 'COMPLETADA', 'ANULADA'
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_venta_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id),
                       CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Tabla de Detalle de Venta
CREATE TABLE detalle_venta (
                               id BIGSERIAL PRIMARY KEY,
                               venta_id BIGINT NOT NULL,
                               producto_id BIGINT NOT NULL,
                               cantidad INT NOT NULL,
                               precio_unitario DECIMAL(10, 2) NOT NULL,
                               subtotal DECIMAL(10, 2) NOT NULL,
                               CONSTRAINT fk_detalle_venta FOREIGN KEY (venta_id) REFERENCES venta(id) ON DELETE CASCADE, -- Si se borra la venta, se borra el detalle.
                               CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES producto(id)
);

-- Tablas de Caja (Ingresos y Egresos)
CREATE TABLE ingreso (
                         id BIGSERIAL PRIMARY KEY,
                         fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                         monto DECIMAL(10, 2) NOT NULL,
                         descripcion TEXT NOT NULL,
                         usuario_id BIGINT,
                         CONSTRAINT fk_ingreso_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE egreso (
                        id BIGSERIAL PRIMARY KEY,
                        fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        monto DECIMAL(10, 2) NOT NULL,
                        descripcion TEXT NOT NULL,
                        usuario_id BIGINT,
                        CONSTRAINT fk_egreso_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Índices para búsquedas rápidas.
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_venta_fecha ON venta(fecha);
CREATE INDEX idx_cliente_dni ON cliente(dni);
CREATE INDEX idx_usuario_username ON usuario(username);