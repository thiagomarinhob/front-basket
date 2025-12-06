#!/usr/bin/env node

/**
 * Script para cadastrar times em lote
 * Uso: node scripts/create-teams.js [token]
 * Ou: TOKEN=seu-token node scripts/create-teams.js
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const teams = [
  {
    "name": "Infodigital",
    "shortName": "Infodigital",
    "logoUrl": "https://sua-storage.com/logos/infodigital.png",
    "location": "Fortaleza",
    "description": "Time da Infodigital"
  },
  {
    "name": "Henrique Jorge Basketball",
    "shortName": "HJ Basket",
    "logoUrl": "https://sua-storage.com/logos/henrique-jorge.png",
    "location": "Fortaleza",
    "description": "Equipe do bairro Henrique Jorge"
  },
  {
    "name": "Universidade Federal do Ceará",
    "shortName": "UFC",
    "logoUrl": "https://sua-storage.com/logos/ufc.png",
    "location": "Fortaleza",
    "description": "Time universitário da UFC"
  },
  {
    "name": "São Gonçalo do Amarante",
    "shortName": "São Gonçalo",
    "logoUrl": "https://sua-storage.com/logos/sao-goncalo.png",
    "location": "São Gonçalo do Amarante",
    "description": "Representante municipal"
  },
  {
    "name": "Apuiarés",
    "shortName": "Apuiarés",
    "logoUrl": "https://sua-storage.com/logos/apuiares.png",
    "location": "Apuiarés",
    "description": "Representante municipal"
  },
  {
    "name": "BPA DL",
    "shortName": "BPA",
    "logoUrl": "https://sua-storage.com/logos/bpa-dl.png",
    "location": "Desconhecido",
    "description": "Equipe BPA DL"
  },
  {
    "name": "Acaraú",
    "shortName": "Acaraú",
    "logoUrl": "https://sua-storage.com/logos/acarau.png",
    "location": "Acaraú",
    "description": "Representante municipal"
  },
  {
    "name": "RELAX",
    "shortName": "RELAX",
    "logoUrl": "https://sua-storage.com/logos/relax.png",
    "location": "Desconhecido",
    "description": "Equipe RELAX"
  },
  {
    "name": "KLG/5SHOTS",
    "shortName": "KLG",
    "logoUrl": "https://sua-storage.com/logos/klg-5shots.png",
    "location": "Desconhecido",
    "description": "Equipe KLG/5SHOTS"
  },
  {
    "name": "DMB",
    "shortName": "DMB",
    "logoUrl": "https://sua-storage.com/logos/dmb.png",
    "location": "Desconhecido",
    "description": "Equipe DMB"
  },
  {
    "name": "Clube de Basquetebol Moradanovense",
    "shortName": "Moradanovense",
    "logoUrl": "https://sua-storage.com/logos/moradanovense.png",
    "location": "Morada Nova",
    "description": "Clube de Morada Nova"
  },
  {
    "name": "Guarany de Sobral",
    "shortName": "Guarany",
    "logoUrl": "https://sua-storage.com/logos/guarany-sobral.png",
    "location": "Sobral",
    "description": "Tradicional equipe de Sobral"
  }
];

async function login(email, password) {
  const url = `${API_BASE_URL}/auth/sign-in`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Erro no login ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function createTeam(team, token) {
  const url = `${API_BASE_URL}/teams`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(team)
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`Erro ${response.status}: ${errorText}`);
  }

  return response.json();
}

async function main() {
  let token = process.argv[2] || process.env.TOKEN;
  
  // Se não tiver token, tenta fazer login com credenciais
  if (!token) {
    const email = process.env.EMAIL || process.argv[3];
    const password = process.env.PASSWORD || process.argv[4];
    
    if (email && password) {
      console.log('🔐 Fazendo login...');
      try {
        token = await login(email, password);
        console.log('✅ Login realizado com sucesso!\n');
      } catch (error) {
        console.error('❌ Erro no login:', error.message);
        process.exit(1);
      }
    } else {
      console.error('❌ Erro: Token de autenticação ou credenciais não fornecidas.');
      console.error('\nOpções de uso:');
      console.error('  1. Com token:');
      console.error('     node scripts/create-teams.js [token]');
      console.error('     TOKEN=seu-token node scripts/create-teams.js');
      console.error('  2. Com credenciais:');
      console.error('     node scripts/create-teams.js "" [email] [password]');
      console.error('     EMAIL=email PASSWORD=senha node scripts/create-teams.js');
      process.exit(1);
    }
  }

  console.log(`🚀 Iniciando cadastro de ${teams.length} times...\n`);
  console.log(`📍 API: ${API_BASE_URL}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const number = i + 1;
    
    try {
      console.log(`[${number}/${teams.length}] Cadastrando: ${team.name}...`);
      const result = await createTeam(team, token);
      console.log(`✅ Sucesso: ${team.name} (ID: ${result.id || 'N/A'})\n`);
      successCount++;
      
      // Pequeno delay entre requisições para não sobrecarregar o servidor
      if (i < teams.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error(`❌ Erro ao cadastrar ${team.name}:`, error.message);
      errorCount++;
      
      // Se for erro 409 (conflito - time já existe), continua
      if (error.message.includes('409')) {
        console.log(`⚠️  Time "${team.name}" já existe, pulando...\n`);
      } else {
        console.log('');
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Resumo:`);
  console.log(`   ✅ Sucessos: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);
  console.log(`   📝 Total: ${teams.length}`);
  console.log('='.repeat(50));
}

main().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});

