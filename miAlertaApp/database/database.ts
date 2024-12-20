import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const db = SQLite.openDatabaseAsync("db_seguridadPersonal.db");

export const initializeDatabase = async () => {
  const database = await db;

  // Eliminar la bd
//   try {
//     await database.execAsync(`DROP TABLE IF EXISTS Usuario;`);
//     await database.execAsync(`DROP TABLE IF EXISTS UbicacionCompartida;`);
//     await database.execAsync(`DROP TABLE IF EXISTS ContactoEmergencia;`);
//     await database.execAsync(`DROP TABLE IF EXISTS Alerta;`);
//     await database.execAsync(`DROP TABLE IF EXISTS IntentoAutenticacion;`);

//     console.log("Todas las tablas han sido eliminadas con éxito");
//   } catch (error) {
//     console.error("Error al eliminar las tablas:", error);
//   }
// };
  try {
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS Usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        celular INTEGER NOT NULL,
        pinHash TEXT NOT NULL,
        firebaseId TEXT
      );`
    );

    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS ContactoEmergencia (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idUsuario INTEGER NOT NULL,
          nombre TEXT NOT NULL,
          celular TEXT NOT NULL,
          relacion TEXT,
          esPredeterminado BOOLEAN NOT NULL DEFAULT 0,
          FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
          );`
    );

    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS UbicacionCompartida (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idUsuario INTEGER NOT NULL,
        idContactoEmergencia INTEGER NOT NULL,
        tiempoInicio DATETIME NOT NULL,
        tiempoFin DATETIME,
        ubicacion TEXT NOT NULL,
        FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
        FOREIGN KEY (idContactoEmergencia) REFERENCES ContactoEmergencia(id)
      );`
    );

    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS Alerta (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          idUsuario INTEGER NOT NULL,
          idUbicacionCompartida INTEGER NOT NULL,
          idContactoEmergencia INTEGER NOT NULL,
          mensaje TEXT NOT NULL,
          FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
          FOREIGN KEY (idUbicacionCompartida) REFERENCES UbicacionCompartida(id),
          FOREIGN KEY (idContactoEmergencia) REFERENCES ContactoEmergencia(id)
          );`
    );
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS IntentoAutenticacion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idUsuario INTEGER NOT NULL,
      tiempoIntento DATETIME NOT NULL,
      valido BOOLEAN NOT NULL,
      FOREIGN KEY (idUsuario) REFERENCES Usuario(id)
      );`
    );
    console.log("Todas las tablas han sido creadas con éxito");
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
};
initializeDatabase();
//---------------- FUNCIONES -----------------
// Obtener todos los usuarios
//Usuarios
export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  celular: number;
  pinHash: string;
  firebaseId: string;
};

export const getUsuarios = async (): Promise<Usuario[]> => {
  const database = await db;

  try {
    const result = await database.getAllAsync("SELECT * FROM Usuario");
    console.log("Usuarios obtenidos:", result);
    return result as Usuario[];
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return [];
  }
};

export const addUsuario = async (
  nombre: string,
  email: string,
  celular: number,
  pinHash: string,
  firebaseId: string
): Promise<boolean> => {
  const database = await db;

  try {
    await database.runAsync(
      "INSERT INTO Usuario (nombre, email, celular, pinHash, firebaseId) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, celular, pinHash, firebaseId]
    );
    return true; // Devuelve true si se agrega correctamente
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    return false; // Devuelve false si hay un error
  }
};

export const getNumericIdByFirebaseId = async (
  firebaseId: string
): Promise<number | null> => {
  const database = await db;

  try {
    const result = await database.getFirstAsync<{ id: number }>(
      "SELECT id FROM Usuario WHERE firebaseId = ?",
      [firebaseId]
    );
    console.log("el id con el firebase es:", result); // Log del resultado de la consulta
    return result ? result.id : null; // Devuelve el ID numérico si se encuentra, o null
  } catch (error) {
    console.error("Error al obtener el ID numérico por Firebase ID:", error);
    return null; // Retorna null en caso de error
  }
};
export const getUserByFirebaseId = async (
  firebaseId: string
): Promise<Usuario | null> => {
  const database = await db;
  try {
    const result = await database.getFirstAsync(
      "SELECT * FROM Usuario WHERE firebaseId = ?",
      [firebaseId]
    );
    console.log(
      "Usuario encontrado por -getUserByFirebaseId- Firebase ID:",
      result
    ); // Log del usuario encontrado
    return result ? (result as Usuario) : null; // Devuelve el usuario encontrado o null
  } catch (error) {
    console.error("Error al obtener el usuario por Firebase ID:", error);
    return null;
  }
};


// CONTACTO EMERGENCIA
//Usuarios
export type ContactoEmergencia = {
  id: number;
  idUsuario: number;
  nombre: string;
  celular: string;
  relacion?: string;
  esPredeterminado: boolean;
};
// agregar contacto
export const getContactoEmergenciaByIdUser = async (idUsuario: number): Promise<ContactoEmergencia[]> => {
  const database = await db;
  try {
    const result = await database.getAllAsync(
      "SELECT * FROM ContactoEmergencia WHERE idUsuario = ?",
      [idUsuario]
    );

    // Verifica que result sea un arreglo y cada elemento sea del tipo Habit
    if (Array.isArray(result)) {
      return result.map((item) => item as ContactoEmergencia);
    } else {
      console.warn("Se esperaba un arreglo, pero se obtuvo:", result);
      return []; // Devuelve un arreglo vacío si no es un arreglo
    }
  } catch (error) {
    console.error("Error al obtener los hábitos:", error);
    return []; // Devuelve un arreglo vacío en caso de error
  }
};

export const addContactoEmergencia = async (
  idUsuario: number,
  nombre: string,
  celular: string,
  relacion?: string,
): Promise<boolean> => {
  const database = await db;

  try {
    await database.runAsync(
      "INSERT INTO ContactoEmergencia (idUsuario, nombre, celular, relacion) VALUES (?, ?, ?, ?)",
      [idUsuario, nombre, celular, relacion || ""]
    );
    console.log("Contacto de emergencia agregado con éxito");
    return true; // Devuelve true si se agrega correctamente
  } catch (error) {
    console.error("Error al agregar el contacto de emergencia:", error);
    return false; // Devuelve false si hay un error
  }
};

export const deleteContactoEmergencia = async (id: number): Promise<boolean> => {
  const database = await db;

  try {
    // Eliminar el contacto de emergencia con el id proporcionado
    await database.runAsync(
      "DELETE FROM ContactoEmergencia WHERE id = ?",
      [id]
    );
    console.log("Contacto de emergencia eliminado con éxito");
    return true; // Devuelve true si se elimina correctamente
  } catch (error) {
    console.error("Error al eliminar el contacto de emergencia:", error);
    return false; // Devuelve false si hay un error
  }
};

export const updateContactoPredeterminado = async (esPredeterminado: boolean, id: number) => {
  const database = await db; 
  try {
    if (esPredeterminado) {
      // Si se está marcando un contacto como predeterminado
      // Primero, desmarcar todos los demás contactos como predeterminados
      await database.runAsync(
        "UPDATE ContactoEmergencia SET esPredeterminado = 0 WHERE esPredeterminado = 1"
      );
    }

    // Luego, actualizar el contacto específico
    await database.runAsync(
      "UPDATE ContactoEmergencia SET esPredeterminado = ? WHERE id = ?",
      [esPredeterminado ? 1 : 0, id] // Establecer el estado del contacto actual
    );

  } catch (error) {
    console.error("Error al actualizar el contacto:", error);
    throw error; // Lanza el error para manejarlo en la función principal
  }
};