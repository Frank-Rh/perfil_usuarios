const Discord = require("discord.js");
//requires discord para los mensajes, client y todo eso xD, se instala con npm i discord.js debe que tener ya node.js instalado y el archivo package.json (npm init -y)
const client = new Discord.Clien({ disableMentions: "all" });
//nuevo cliente con todas las menciones desabilitadas
const config =  require("./config.json");
//se requiere configs, en el archivo debe estar prefijo y token
const fs = require("fs");
// fs para poder trabajar con los archivos .json
const fse = require("fs-extra");
// fs extra para trabajar ahun mas con los archivos

client.once("ready", () => {
  console.log(`${client.user.tag} esta prendido`)
})
// con el evento ready el bot mandara un mensaje a consola donde avisara que ya esta prendido

const user_nuevo = {
    "Apodo": "No establecido",
    "Sexo": "No establecido",
    "Pais": "No establecido",
    "Descripcion": "No tiene alguna descripcion",
    "Imagen_Presentacion": "https://i.imgur.com/YJmKHUa.jpg"
}
// estas serian los valores por defecto 


async function Registrar(id){
    fse.outputFile(`./users/${id}.json`, JSON.stringify(user_nuevo)).then(() => {
        console.log(`Nuevo user ${id}`);
    }).catch(err => console.log(err))
}
/*Una funcion async para registrar la id del usuario en un archivo con los valores por defecto, 
cada que se registre un nuevo usuario aparecera en consola in mensaje,
si ay un error al registrar en la propia consola aparecera un error
*/

async function YaRegistro(id){
    var path = `./users/${id}.json`;
    try {
        return fs.existsSync(path)
    } catch (e) {return false;}
}
// Una funcion async que indica si el usario ya tiene un archivo con su base de datos 

client.on("message", async message => { // evento message con valor message en una funcion async
  if(message.author.bot) return; // Si el autor del mensaje es un bot no reaccionara
  if(message.content.indexOff(config.prefix) !== 0) return; // si el mensaje no contiene el prefijo pos no hara nada
  if(!message.content.startsWith(config.prefix)) return; // Si el mensaje no empiesa con el prefijo no hara nada
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g); // Argumentos para usarlos despues xd
  let command = args.shift().toLocaleLowerCase(); 
  /*Supongamos que t? es el prefijo, el comando seria la palabra que va despues del comando por ejemplo: t?ping 
  t? es el prefijo y ping el comando, otro ejemplo seria "t?say Hola como estas"
  t? = prefijo || say = command || Hola como estas = args*/
  if(command === "registrar"){
     var existe = await YaRegistro(message.member.user.id);
     if(!existe) return await Registrar(message.member.id), message.channel.send("Te estoy creando tu base de datos").then((msg) => {
        msg.edit("Listo ya tienes tu base de datos")
     })
     if(existe){
        message.channel.send("Ya tienes datos creados")
     }
    // Este comando lo que hace es ver si un usuario ya esta registrado, si ya lo esta retornara un mensaje para indicar que ya tiene datos, de lo contrario le crea el archivo(datos) y retorna un mensaje
  } else if(command === "perfil" || command === "pr"){
        var existe = await YaRegistro(message.member.user.id);
        if(!existe) return await Registrar(message.member.id), message.channel.send("Te estoy creando tu base de datos").then((msg) => {
            msg.edit("Listo ya tienes tu base de datos")
        })
        const userDB = require(`./users/${message.member.id}.json`)
        let embeuser = new Discord.MessageEmbed()
        .setAuthor(message.member.user.tag, message.member.user.avatarURL({dynamic: true}))
        .addFields(
            {
                name: "Nombre",
                value: `${message.member.user.tag}`,
                inline: true
            },
            {
                name: "Apodo",
                value: userDB.Apodo,
                inline: true
            },
            {
                name: "Sexo",
                value: userDB.Sexo,
                inline: true
            },
            {
                name: "Pais",
                value: userDB.Pais,
                inline: true
            },
            {
                name: "Imagen de Perfil",
                value: `\`${userDB.Imagen_Presentacion}\``,
                inline: true
            },
            {
                name: "Descripcion",
                value: userDB.Descripcion,
                inline: false
            }
        )
        .setColor("RANDOM")
        .setImage(userDB.Imagen_Presentacion)
        .setTimestamp()
        .setFooter("Por ahora esto sige mejorandose, luego estara mejor")
        message.channel.send(embeuser)
    // este comando hace practicamente lo mismo que el otra, pero esta muestra los valores del archivo del usario que envio el mensaje y no se como explicar bien xD
  }
})

client.login(cpnfig.token);
