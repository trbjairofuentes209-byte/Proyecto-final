import { supabase } from "./config.js";

const { data } = await supabase.auth.getSession();

if (!data.session) { window.location.href = "login.html";

 }

 const usuario = data.session.user;

 const inputImagen = document.getElementById("imagenPerfil");
const fotoPerfil = document.getElementById("fotoPerfil");
const nombreArchivo = document.getElementById("nombreArchivo");

inputImagen.addEventListener("change", () => {

    if (inputImagen.files.length > 0) {

        nombreArchivo.textContent = inputImagen.files[0].name;

    }

});

 document.getElementById("correo").value = usuario.email;

 const { data: perfil, error } = await supabase .from("perfiles") .select("*") .eq("id", usuario.id) .single();

 if (error) { console.error(error);

    }
    
    else { document.getElementById("nombre").value = perfil.nombre || ""; document.getElementById("empresa").value = perfil.empresa || "";

         if (perfil.foto) {

        fotoPerfil.src = perfil.foto;

    }
     }
     const formulario = document.getElementById("formPerfil");

     formulario.addEventListener("submit", async (event) =>
        
    { event.preventDefault();

        const nombre = document.getElementById("nombre").value;
         const empresa = document.getElementById("empresa").value;

         let urlFoto = perfil.foto;

if (inputImagen.files.length > 0) {

    const archivo = inputImagen.files[0];

    const nombreArchivoStorage =
        `${usuario.id}-${Date.now()}`;

    const { error: errorStorage } =
        await supabase.storage
            .from("avatars")
            .upload(nombreArchivoStorage, archivo, {
                upsert: true
            });

    if (errorStorage) {

        console.error(errorStorage);
        alert("Error al subir la imagen.");

        return;

    }

    const { data: url } = supabase.storage
        .from("avatars")
        .getPublicUrl(nombreArchivoStorage);

    urlFoto = url.publicUrl;

}

         const { error } = await supabase
          .from("perfiles")
           .update({

    nombre: nombre,
    empresa: empresa,
    foto: urlFoto

})
          .eq("id", usuario.id);
          
          if (error) {
            alert("Error al guardar los cambios.");
            console.error(error);
            return; 
        }

        alert("Perfil actualizado correctamente.");

        });