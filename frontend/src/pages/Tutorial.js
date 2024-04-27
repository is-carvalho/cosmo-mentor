export const tutorialSteps = [
    {title:"Bem vindo ao Cosmo!",
    content:"Gostaria de realizar o tutorial da plataforma?",
    target:"body",
    placement:"center",
    disableBeacon:true,
    styles:{
        tooltip:{width:600,height:180},
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:5},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20},
        buttonSkip:{fontSize:16,backgroundColor:"#DAEBFB",borderRadius:4,color:"#0070E8",fontWeight:"bold"},
    },
    showSkipButton:true,
    
    
    
    
},
    {title:'Clicando na sua foto de perfil (canto superior direito), você abre essa aba, em que você pode ver e editar suas informações no perfil, ou encerrar a sessão do Cosmo na sua conta',
    content:"",
    target:".profile_dd.active",
    placement:"left",
    event:"click",
    styles:{
        // tooltip:{width:600,height:165},
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    getStepTargetElement:".link-menu",
    
    
},
{title:'Clicando no botão do canto superior esquerdo, você abre a barra lateral, em que você pode acessar as páginas do site',
    content:"",
    target:".sidebar",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'No botão de "Meu Progresso" você retorna à página inicial do site, e pode checar seu progresso, notificações, e cursos',
    content:"",
    target:"#menu-button",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'Você também pode retornar à página inicial clicando na logo do Cosmo',
    content:"",
    target:"#cosmo-logo",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'No fórum, você pode criar perguntas sobre as questões do site que você não consegue resolver, ou responder às perguntas de outras pessoas',
    content:"",
    target:"#forum-button",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'No botão de cursos, você acessa os cursos do Cosmo, e pode entrar na sua turma para resolver às questões',
    content:"",
    target:"#cursos-button",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'No Caça-Bugs, você se utiliza da ferramenta pedagógica de mesmo nome. Essa aba contém questões nas quais você deve analisar um código incorreto e indicar qual valor que vai dar um bug no programa, se nele inserido.',
    content:"",
    target:"#cacabugs-button",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'No ranking, você pode checar a sua posição e pontuação em comparação aos outros alunos, seja de maneira geral, seja na sua turma.',
    content:"",
    target:"#ranking-button",
    placement:"right",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
{title:'Você pode sempre checar o tutorial de novo clicando no botão de tutorial',
    content:"",
    target:"#tutorial-button",
    placement:"bottom",
    event:"click",
    styles:{
        tooltipTitle:{fontWeight:"bold",fontSize:20,marginTop:15},
        tooltipContent:{fontSize:18},
        buttonNext:{fontSize:20,marginLeft:10},
        buttonBack:{fontSize:18,backgroundColor:"#DAEBFB",borderRadius:4},
    },
    
    
},
]