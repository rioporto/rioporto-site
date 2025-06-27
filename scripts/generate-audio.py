#!/usr/bin/env python3
"""
Script para gerar todos os áudios do minicurso usando Edge-TTS
Autor: Rio Porto P2P
Data: 29/01/2025
ATUALIZADO: Corrigido nome da voz
"""

import os
import sys
import asyncio
import edge_tts
from pathlib import Path
import json

# Configurações - VOZES CORRETAS
# Opções de vozes masculinas brasileiras:
# - pt-BR-AntonioNeural
# - pt-BR-FabioNeural  
# - pt-BR-JulioNeural
VOICE = "pt-BR-AntonioNeural"  # Nome correto da voz!
RATE = "+0%"  # Velocidade normal
VOLUME = "+0%"  # Volume normal

# Determinar o diretório correto
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "audio" / "minicurso"

print(f"📁 Script rodando em: {SCRIPT_DIR}")
print(f"📁 Raiz do projeto: {PROJECT_ROOT}")
print(f"📁 Diretório de saída: {OUTPUT_DIR}")

# Textos para narração (mesmo conteúdo anterior)
AUDIO_TEXTS = {
    "01-capa.mp3": """
        Bem-vindo ao Manual P2P: Negocie Bitcoin como um Profissional. 
        
        Este é o guia definitivo para você aprender a comprar ou vender Bitcoin 
        com total segurança e privacidade. 
        
        Sou Johnny Ferreira, especialista em Bitcoin e criptomoedas, e vou guiar 
        você nesta jornada rumo à soberania financeira. 
        
        Prepare-se para descobrir os segredos do mercado P2P e transformar sua 
        forma de negociar criptomoedas.
        
        Vamos começar!
    """,
    
    "02-introducao.mp3": """
        Introdução: A Revolução Silenciosa do Dinheiro Ponto a Ponto.
        
        Em 2008, um documento revolucionário intitulado "Bitcoin: Um Sistema de 
        Dinheiro Eletrônico Peer-to-Peer" foi publicado por uma figura anônima 
        conhecida como Satoshi Nakamoto. 
        
        A visão era clara e poderosa: permitir que pagamentos online fossem 
        enviados diretamente de uma parte para outra, sem a necessidade de 
        passar por uma instituição financeira. 
        
        Essa ideia de transação "ponto a ponto", ou P2P, é a alma do Bitcoin 
        e o fundamento de uma nova era de soberania financeira.
        
        Com o tempo, para facilitar o acesso, surgiram as corretoras. 
        Elas ofereceram conveniência, mas com um custo: a reintrodução de 
        intermediários. Ao usar uma corretora centralizada, você confia seus 
        fundos, seus dados e sua privacidade a uma terceira parte.
        
        Hoje, investidores maduros perceberam que a verdadeira promessa das 
        criptomoedas está no controle e na liberdade. Esse amadurecimento 
        leva a um retorno às origens: a negociação P2P.
        
        Este manual é seu guia. Nosso objetivo é fornecer o conhecimento para 
        você negociar não como um espectador, mas como um profissional — com 
        segurança, confiança e total controle sobre seu patrimônio.
    """,
    
    "03-cap1.mp3": """
        Capítulo 1: Descomplicando o P2P.
        O Que é e Como Funciona na Prática?
        
        P2P é a abreviação de Peer-to-Peer, que significa "ponto a ponto". 
        
        Pense em vender um item usado online. Você negocia diretamente com o 
        comprador, sem uma loja como intermediária. No mundo cripto, é a mesma 
        lógica: comprar e vender criptomoedas diretamente entre duas pessoas, 
        fora de uma corretora.
        
        A negociação P2P materializa a promessa de transações financeiras diretas, 
        devolvendo o poder e o controle aos indivíduos.
        
        Vamos entender o passo a passo de uma negociação P2P:
        
        Primeiro: Contato e Cotação. Você entra em contato com o vendedor, 
        como a RIO PORTO P2P, e recebe a cotação atual.
        
        Segundo: Acordo de Termos. Vocês definem a quantidade de cripto 
        e o meio de pagamento, geralmente PIX.
        
        Terceiro: Pagamento e Confirmação. O comprador transfere o valor 
        em Reais. O vendedor confirma o recebimento no extrato do banco.
        
        Quarto: Liberação das Criptos. Com o pagamento confirmado, o vendedor 
        envia as criptomoedas diretamente para a carteira do comprador.
        
        É um processo simples, direto e seguro quando feito corretamente.
    """,
    
    "04-cap2.mp3": """
        Capítulo 2: P2P versus Corretoras.
        Qual o Melhor Caminho para Você?
        
        A negociação P2P oferece vantagens significativas que as corretoras 
        não conseguem replicar.
        
        Primeira vantagem: Privacidade e Controle. No P2P, você compartilha 
        menos dados pessoais e mantém o controle total sobre suas informações.
        
        Segunda: Flexibilidade de Pagamento. Enquanto corretoras limitam suas 
        opções, o P2P aceita uma vasta gama de métodos de pagamento.
        
        Terceira: Custos Menores. As taxas P2P são geralmente mais competitivas 
        e, principalmente, transparentes. Sem surpresas desagradáveis.
        
        Quarta e mais importante: Soberania e Autocustódia. Seus fundos nunca 
        ficam sob custódia de um terceiro. Você tem o controle real e imediato 
        dos seus ativos.
        
        Cansado de taxas surpresa e valores que mudam a todo instante? 
        Na RIO PORTO P2P, a regra é clara: o preço é fixo e você sabe 
        exatamente quanto vai receber antes mesmo de fechar o negócio.
        
        Acesse nosso site e faça uma cotação para experimentar a diferença!
    """,
    
    "05-cap3.mp3": """
        Capítulo 3: Sua Fortaleza Digital.
        O Poder da Autocustódia e das Carteiras.
        
        "Not Your Keys, Not Your Coins" - Se as chaves não são suas, 
        as moedas não são suas.
        
        Este é o mantra da soberania no mundo das criptomoedas. 
        
        Deixar suas criptos em uma corretora é como deixar ouro no cofre 
        de um banco: você confia que eles cuidarão bem. Mas se o banco, 
        ou a corretora, falir, for hackeado ou congelar sua conta, 
        você perde acesso aos seus ativos.
        
        A negociação P2P, combinada com a autocustódia, resolve esse problema. 
        Ao negociar conosco, você recebe as criptomoedas diretamente em uma 
        carteira que só você controla.
        
        Existem dois tipos principais de carteiras:
        
        Hot Wallets, ou Carteiras Quentes: São ótimas para o dia a dia 
        e pequenas quantias. A vantagem é a conveniência. O risco é que 
        estão conectadas à internet.
        
        Cold Wallets, ou Carteiras Frias: Ideais para guardar grandes 
        valores a longo prazo. Oferecem segurança máxima, mas são menos 
        práticas para uso diário.
        
        Assumir a autocustódia é uma mudança de mentalidade. Exige 
        responsabilidade pessoal, mas garante sua soberania financeira.
        
        Precisa de ajuda? A RIO PORTO P2P oferece consultoria exclusiva 
        de autocustódia. Nós guiamos você, passo a passo, na escolha e 
        configuração da sua carteira ideal.
    """,
    
    "06-cap4.mp3": """
        Capítulo 4: Navegando em Águas Seguras.
        O Guia Antifraude Definitivo.
        
        O medo de ser enganado é uma grande barreira no P2P. Mas ao entender 
        como os golpes funcionam, você se torna capaz de evitá-los.
        
        Vamos conhecer os principais golpes:
        
        Primeiro: O Golpe do Comprovante Falso. O golpista envia um comprovante 
        de PIX ou TED falso e pressiona pela liberação das criptos. 
        Lembre-se: confie APENAS no seu extrato bancário oficial.
        
        Segundo: O Golpe da Triangulação. O golpista usa uma terceira vítima 
        para depositar dinheiro na sua conta. Você envia as criptos para o 
        golpista e depois sua conta bancária fica comprometida.
        
        Como se proteger? Aqui está seu checklist de segurança P2P:
        
        Regra número um: Confie APENAS no seu extrato bancário. 
        Nunca em imagens de comprovante.
        
        Regra dois: Negocie apenas com o titular da conta. 
        Pagamento de terceiros é sinal de alerta máximo.
        
        Regra três: Comece com pouco ao negociar com alguém novo. 
        Construa confiança gradualmente.
        
        Regra quatro: Desconfie de ofertas milagrosas. 
        Preços muito abaixo do mercado são iscas de golpistas.
        
        A tranquilidade de ter um especialista ao seu lado não tem preço. 
        Nosso principal produto não é Bitcoin; é paz de espírito. 
        A RIO PORTO P2P gerencia todos esses riscos para você.
    """,
    
    "07-cap5.mp3": """
        Capítulo 5: A Burocracia sem Medo.
        Legalidade e Impostos no Brasil.
        
        Vamos esclarecer as principais dúvidas legais:
        
        P2P é legal no Brasil? Sim! Não há nenhuma lei que proíba a compra 
        e venda de criptomoedas diretamente entre pessoas. O Marco Legal das 
        Criptos, Lei número 14.478 de 2022, trouxe ainda mais segurança 
        jurídica ao setor.
        
        Sobre a IN 1888 da Receita Federal: É uma declaração informativa mensal. 
        Você deve declarar se o total das suas operações, somando compras e vendas, 
        em P2P ou corretoras estrangeiras ultrapassar 30 mil reais no mês.
        
        Quanto ao Imposto de Renda sobre Ganhos de Capital: Há isenção de imposto 
        sobre o lucro para vendas totais de criptoativos de até 35 mil reais por mês. 
        Acima disso, o lucro é tributado com alíquotas progressivas.
        
        Importante: Essas informações são para fins educativos. 
        Consulte sempre um contador especializado em criptomoedas para 
        orientações específicas sobre sua situação.
        
        A RIO PORTO P2P opera com total transparência e conformidade legal, 
        facilitando sua vida na hora de declarar.
    """,
    
    "08-cap6.mp3": """
        Capítulo 6: A Vantagem RIO PORTO P2P.
        Por que somos diferentes?
        
        Nossa vantagem competitiva está em quatro pilares fundamentais:
        
        Primeiro: Segurança Garantida. Nossos processos rigorosos atuam 
        como um escudo contra fraudes. Verificamos cada transação 
        minuciosamente para sua proteção.
        
        Segundo: Simplicidade e Suporte Humano. Oferecemos atendimento 
        ágil e especializado. Você fala com pessoas reais, não com robôs. 
        Nossa equipe entende suas necessidades e responde rapidamente.
        
        Terceiro: Soberania com Tranquilidade. Somos defensores ferrenhos 
        da autocustódia. Os ativos são enviados diretamente para sua carteira, 
        sem intermediários, sem custódia, sem riscos desnecessários.
        
        Quarto: Conformidade e Paz de Espírito. Operamos com uma empresa 
        devidamente estabelecida no país, seguindo todas as regulamentações. 
        Você negocia com total tranquilidade legal.
        
        E tem mais: Bitcoin a partir de apenas 100 reais, com taxa fixa 
        e sem asteriscos ou letras miúdas.
        
        Na RIO PORTO P2P, a transparência vem em primeiro lugar. 
        O valor que você vê é exatamente o valor que você recebe.
        
        Chega de complicações. É hora de negociar Bitcoin do jeito certo!
    """,
    
    "09-conclusao.mp3": """
        Conclusão: Dê o Próximo Passo com Confiança.
        
        Parabéns! Você chegou ao final desta jornada de conhecimento.
        
        A complexidade do P2P se transformou em clareza. Você agora entende 
        como negociar com segurança, proteger seus ativos através da 
        autocustódia e navegar pelo cenário regulatório brasileiro.
        
        A mensagem central deste manual é poderosa: o P2P, feito da maneira 
        correta, é a expressão máxima de controle e soberania sobre seu 
        patrimônio digital.
        
        Você aprendeu a identificar e evitar golpes. Compreendeu as vantagens 
        sobre as corretoras tradicionais. Descobriu o poder da autocustódia. 
        E conheceu seus direitos e deveres perante a legislação.
        
        Agora que você tem o conhecimento, o próximo passo é a ação. 
        
        Chega de correr riscos desnecessários. Chega de entregar o controle 
        dos seus ativos para grandes corporações. Chega de taxas escondidas 
        e surpresas desagradáveis.
        
        Você está pronto para negociar Bitcoin com a segurança, a privacidade 
        e a agilidade que você merece.
        
        A RIO PORTO P2P é sua parceira de confiança nesta nova fase. 
        Descubra por que nossos clientes negociam com total tranquilidade.
        
        Acesse agora rioporto.com e dê o primeiro passo rumo à sua 
        soberania financeira.
        
        Seja bem-vindo ao futuro das finanças. 
        Seja bem-vindo à RIO PORTO P2P.
    """
}

async def list_voices_and_select():
    """Lista vozes disponíveis e retorna a melhor opção masculina"""
    print("\n📢 Buscando vozes disponíveis...")
    try:
        voices = await edge_tts.list_voices()
        pt_voices = [v for v in voices if v["Locale"].startswith("pt-BR")]
        
        male_voices = [v for v in pt_voices if v["Gender"] == "Male"]
        female_voices = [v for v in pt_voices if v["Gender"] == "Female"]
        
        print(f"\nVozes masculinas brasileiras disponíveis:")
        for v in male_voices:
            print(f"   ✅ {v['ShortName']} - {v['FriendlyName']}")
        
        if male_voices:
            selected = male_voices[0]['ShortName']
            print(f"\n🎯 Voz selecionada: {selected}")
            return selected
        else:
            print("⚠️  Nenhuma voz masculina brasileira encontrada!")
            return None
            
    except Exception as e:
        print(f"⚠️  Erro ao listar vozes: {e}")
        # Tentar com as vozes conhecidas
        known_voices = ["pt-BR-AntonioNeural", "pt-BR-FabioNeural", "pt-BR-JulioNeural"]
        print(f"\n🔧 Tentando com vozes conhecidas: {', '.join(known_voices)}")
        return known_voices[0]

async def test_edge_tts(voice_name):
    """Testa se o edge-tts está funcionando com a voz especificada"""
    try:
        print(f"\n🔧 Testando Edge-TTS com voz {voice_name}...")
        test_text = "Teste de áudio"
        test_file = OUTPUT_DIR / "test.mp3"
        
        communicate = edge_tts.Communicate(test_text, voice_name)
        await communicate.save(str(test_file))
        
        if test_file.exists():
            print(f"✅ Edge-TTS está funcionando com {voice_name}!")
            test_file.unlink()  # Remove arquivo de teste
            return True
        else:
            print(f"❌ Edge-TTS não conseguiu criar arquivo com {voice_name}")
            return False
    except Exception as e:
        print(f"❌ Erro ao testar Edge-TTS: {e}")
        return False

async def generate_audio(filename: str, text: str, voice: str):
    """Gera um arquivo de áudio usando Edge-TTS"""
    try:
        print(f"\n🎙️ Gerando: {filename}")
        
        # Limpar o texto (remover espaços extras)
        clean_text = " ".join(text.split())
        print(f"   Tamanho do texto: {len(clean_text)} caracteres")
        print(f"   Voz: {voice}")
        
        # Criar o comunicador
        communicate = edge_tts.Communicate(
            clean_text, 
            voice,
            rate=RATE,
            volume=VOLUME
        )
        
        # Caminho completo do arquivo
        output_path = OUTPUT_DIR / filename
        print(f"   Salvando em: {output_path}")
        
        # Gerar e salvar o áudio
        await communicate.save(str(output_path))
        
        # Verificar se foi criado
        if output_path.exists():
            size = output_path.stat().st_size / 1024  # KB
            print(f"   ✅ Sucesso! Tamanho: {size:.1f} KB")
            return True
        else:
            print(f"   ❌ Arquivo não foi criado")
            return False
        
    except Exception as e:
        print(f"   ❌ Erro: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Função principal"""
    print("🎙️ RIO PORTO P2P - Gerador de Áudios do Minicurso")
    print("=" * 60)
    print(f"Diretório de saída: {OUTPUT_DIR}")
    print("=" * 60)
    
    # Verificar Python e edge-tts
    print(f"\n📊 Informações do sistema:")
    print(f"   Python: {sys.version}")
    
    try:
        import edge_tts
        print(f"   Edge-TTS: Instalado ✅")
    except ImportError:
        print(f"   Edge-TTS: NÃO instalado ❌")
        print("\n⚠️  Por favor, instale o edge-tts:")
        print("   pip install edge-tts")
        return
    
    # Criar diretório se não existir
    print(f"\n📁 Criando diretório de saída...")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    if OUTPUT_DIR.exists():
        print(f"   ✅ Diretório criado/verificado")
    else:
        print(f"   ❌ Não foi possível criar o diretório")
        return
    
    # Descobrir e selecionar voz
    selected_voice = await list_voices_and_select()
    
    if not selected_voice:
        print("\n❌ Não foi possível encontrar uma voz adequada.")
        return
    
    # Testar edge-tts com a voz selecionada
    if not await test_edge_tts(selected_voice):
        print(f"\n⚠️  Edge-TTS não funcionou com {selected_voice}.")
        # Tentar outras vozes conhecidas
        for voice in ["pt-BR-FabioNeural", "pt-BR-JulioNeural"]:
            print(f"\n🔧 Tentando com {voice}...")
            if await test_edge_tts(voice):
                selected_voice = voice
                break
        else:
            print("\n❌ Nenhuma voz funcionou. Verifique sua instalação.")
            return
    
    # Gerar todos os áudios
    total = len(AUDIO_TEXTS)
    success = 0
    
    print(f"\n🚀 Iniciando geração de {total} arquivos de áudio...")
    print(f"   Usando voz: {selected_voice}")
    print("   Isso pode levar alguns minutos...\n")
    
    for filename, text in AUDIO_TEXTS.items():
        if await generate_audio(filename, text, selected_voice):
            success += 1
        
        # Pequena pausa entre gerações
        await asyncio.sleep(1)
    
    # Resumo
    print("\n" + "=" * 60)
    print(f"📊 RESUMO:")
    print(f"   ✅ Sucesso: {success} arquivos")
    print(f"   ❌ Falhas: {total - success} arquivos")
    
    # Listar arquivos criados
    print(f"\n📁 Arquivos no diretório de saída:")
    files = list(OUTPUT_DIR.glob("*.mp3"))
    if files:
        for f in sorted(files):
            size = f.stat().st_size / 1024
            print(f"   ✅ {f.name} ({size:.1f} KB)")
    else:
        print(f"   ❌ Nenhum arquivo MP3 encontrado")
    
    # Criar arquivo de metadados
    metadata = {
        "generated_at": str(Path.cwd()),
        "voice": selected_voice,
        "total_files": total,
        "success": success,
        "failed": total - success,
        "files": [f.name for f in sorted(files)]
    }
    
    metadata_path = OUTPUT_DIR / "metadata.json"
    try:
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        print(f"\n📄 Metadados salvos em: {metadata_path}")
    except Exception as e:
        print(f"\n⚠️  Erro ao salvar metadados: {e}")
    
    if success == total:
        print("\n🎉 SUCESSO! Todos os áudios foram gerados!")
        print(f"📂 Verifique em: {OUTPUT_DIR}")
    elif success > 0:
        print(f"\n⚠️  Processo parcialmente concluído. {success} de {total} arquivos gerados.")
    else:
        print("\n❌ Nenhum arquivo foi gerado. Verifique os erros acima.")

if __name__ == "__main__":
    # Verificar se está no Windows e configurar corretamente
    if sys.platform == 'win32':
        # No Windows, às vezes é necessário
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    
    # Executar
    asyncio.run(main())
