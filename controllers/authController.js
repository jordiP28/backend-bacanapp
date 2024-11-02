const User = require('../models/userModel'); // Asegúrate de que la ruta sea correcta
const bcrypt = require('bcryptjs');
// Registro de usuario
exports.register = async (req, res) => {
  const { nombres, correo, celular, contraseña } = req.body;

  try {
    // Verificar si el correo ya existe
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }

    // Crear nuevo usuario (sin hashear la contraseña aquí)
    const newUser = new User({ nombres, correo, celular, contraseña });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Login de usuario
// Login de usuario
exports.login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ correo });
    console.log('Usuario encontrado:', user); // Verifica el usuario encontrado

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    console.log('Contraseña coincidente:', isMatch); // Verifica si las contraseñas coinciden

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    res.status(200).json({ message: 'Login exitoso', userId: user._id });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};


// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { contraseña: 0 }); // Excluir la contraseña
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};
