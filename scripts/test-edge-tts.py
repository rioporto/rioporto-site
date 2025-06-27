import sys

print("🔍 Verificando instalação do Edge-TTS...")
print(f"Python: {sys.version}")
print(f"Path: {sys.executable}")

try:
    import edge_tts
    print("✅ Edge-TTS está instalado!")
    print(f"   Versão: {edge_tts.__version__ if hasattr(edge_tts, '__version__') else 'Não disponível'}")
except ImportError as e:
    print("❌ Edge-TTS NÃO está instalado!")
    print(f"   Erro: {e}")
    print("\n📦 Para instalar, execute:")
    print("   pip install edge-tts")

print("\n📍 Diretórios do Python:")
for path in sys.path[:5]:
    print(f"   {path}")

input("\nPressione ENTER para sair...")
