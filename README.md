# 2019_TP_PPS_Comanda

Registrate en: https://forms.gle/yZ8xsdWj7W7ECWAG8

![Logo Code for Food](icono_1.png)

# Nombre del equipo
- ## Code for Food

# Integrantes:
 - ### Marcos Ivan Rey [![](github.png)](https://github.com/marcos514  "marcos514")
 - ### Ezequiel Mahafud[![](github.png)](https://github.com/Skieel  "Skieel")
 - ### Micaela Saez  [![](github.png)](https://github.com/micaasaezz "micaasaezz")

# Nuestra Aplicacion
- *Estamos desarollando una aplicacion para un restaurant con Ionic y firebase*

# ¿Como nos organizamos?
- Nos organizamos a travez de **Jira** con **Tickets**.
- Tambien cada ticket esta relacionado con un branch de Github para mantener la organizacion.
- Tenemos el branch **master** el cual mustra la version final y **staging** en el cual testeamos todos las tareas realizadas por cada integrante.

```mermaid
graph TD;
B((Nuevo branch)) --> C(Trabajamos el ticket);
C -- al terminamos --> D{Generamos PR};
D --> E[Se pide revision];
E --> F[Aceptamos los cambios?];
F -- No, pedimos cambios --> C;
C -- Generamos los cambios --> E;
E -- Si --> G[Hacer merge a staging];
G --> H{Todos testeamos los cambios};
H --> I(Funciona?);
I-- No --> C;
I -- Si --> J{Mergeamos a master};
```