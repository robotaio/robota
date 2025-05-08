export default {
    logo: <span style={{ fontWeight: 'bold' }}>Robota</span>,
    project: {
        link: 'https://github.com/robotaio/robota',
    },
    docsRepositoryBase: 'https://github.com/robotaio/robota/tree/main/docs',
    useNextSeoProps() {
        return {
            titleTemplate: '%s – Robota'
        }
    },
    navigation: {
        prev: true,
        next: true,
    },
    sidebar: {
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
    },
    primaryHue: 210,
    banner: {
        key: 'robota-docs',
        text: (
            <a href="https://github.com/robotaio/robota" target="_blank">
                🎉 Robota는 오픈소스 JavaScript AI 라이브러리입니다! →
            </a>
        )
    },
    footer: {
        text: (
            <span>
                MIT {new Date().getFullYear()} © <a href="https://github.com/robotaio/robota" target="_blank">Robota 팀</a>.
            </span>
        ),
    },
    toc: {
        float: true,
    },
    darkMode: true,
    head: (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="쉽게 Agentic AI를 만들 수 있는 JavaScript 라이브러리" />
            <meta name="og:title" content="Robota" />
            <link rel="icon" href="./favicon.ico" />
        </>
    ),
} 