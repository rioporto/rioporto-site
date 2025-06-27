#!/usr/bin/env python3
"""
Script para listar vozes disponíveis do Edge-TTS
"""
import asyncio
import edge_tts

async def main():
    print("🔍 Buscando vozes disponíveis do Edge-TTS...")
    print("=" * 60)
    
    voices = await edge_tts.list_voices()
    
    # Filtrar vozes brasileiras
    pt_br_voices = [v for v in voices if v["Locale"].startswith("pt-BR")]
    
    print(f"\n📢 Encontradas {len(pt_br_voices)} vozes em português brasileiro:\n")
    
    # Separar por gênero
    male_voices = []
    female_voices = []
    
    for voice in pt_br_voices:
        info = {
            'name': voice['ShortName'],
            'display': voice['FriendlyName'],
            'gender': voice['Gender']
        }
        
        if voice['Gender'] == 'Male':
            male_voices.append(info)
        else:
            female_voices.append(info)
    
    # Mostrar vozes masculinas
    print("👨 VOZES MASCULINAS:")
    for v in male_voices:
        print(f"   Nome: {v['name']}")
        print(f"   Display: {v['display']}")
        print()
    
    # Mostrar vozes femininas
    print("👩 VOZES FEMININAS:")
    for v in female_voices:
        print(f"   Nome: {v['name']}")
        print(f"   Display: {v['display']}")
        print()
    
    # Recomendar
    if male_voices:
        print(f"✅ Voz masculina recomendada: {male_voices[0]['name']}")
    
    return male_voices[0]['name'] if male_voices else None

if __name__ == "__main__":
    voice = asyncio.run(main())
