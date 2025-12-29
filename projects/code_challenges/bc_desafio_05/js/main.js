const NOMBRES_COMPLETOS = {
  mario: "Mario",
  luigi: "Luigi",
  bowser: "Bowser Morton Koopa",
  peach: "Princesa Peach Toadstool",
  yoshi: "T. Yoshisaur Munchakoopas",
  toad: "Toad",
  toadette: "Toadette",
  daisy: "Princesa Daisy"
};

document.addEventListener("DOMContentLoaded", () => {
  const spanNombre = document.querySelector("h1 span");
  const btn = document.getElementById("btn-presentar");
  const cajas = document.getElementById("cajas");

  let visibleId = null;

  function hideCurrent() {
    if (!visibleId) return;
    const el = document.getElementById(visibleId);
    if (el) el.removeAttribute("title");
    visibleId = null;
  }

  function show(id) {
    if (visibleId && visibleId !== id) hideCurrent();

    const el = document.getElementById(id);
    if (!el) return false;

    el.setAttribute("title", "Presentado");
    visibleId = id;

    spanNombre.textContent = NOMBRES_COMPLETOS[id] ?? "(desconocido)";
    return true;
  }

  function toggle(id) {
    if (visibleId === id) {
      hideCurrent();
      spanNombre.textContent = "";
      return;
    }
    show(id);
  }

  btn.addEventListener("click", () => {
    const respuesta = prompt(
      "¿Quién se presenta hoy? (Mario, Luigi, Bowser, Peach, Yoshi, Toad, Toadette, Daisy)"
    );
    console.log("Respuesta del usuario:", respuesta);
    if (!respuesta) return;

    const clave = respuesta.trim().toLowerCase();
    const nombreCompleto = NOMBRES_COMPLETOS[clave];

    if (!nombreCompleto) {
      return;
    }

    show(clave);
  });

  cajas.addEventListener("click", (e) => {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;
    if (target.parentElement?.id !== "cajas") return;

    const id = target.id;
    if (!id) return;

    if (!Object.prototype.hasOwnProperty.call(NOMBRES_COMPLETOS, id)) return;

    toggle(id);
  });
});
