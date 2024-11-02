const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  correo: { type: String, required: true, unique: true }, // Asegúrate de que el correo sea único
  celular: { type: String, required: true },
  contraseña: { type: String, required: true },
}, { timestamps: true });

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (this.isModified('contraseña')) {
    this.contraseña = await bcrypt.hash(this.contraseña, 10);
  }
  next();
});

// Método para verificar la contraseña
userSchema.methods.verifyPassword = async function(contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

module.exports = mongoose.model('User', userSchema);
