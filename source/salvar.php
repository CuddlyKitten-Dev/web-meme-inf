<?php
$arquivo = 'objects.json';

// Lê o conteúdo atual
if (file_exists($arquivo)) {
  $json = file_get_contents($arquivo);
  $dados = json_decode($json, true);
} else {
  $dados = [];
}

// Recebe o JSON enviado
$input = file_get_contents('php://input');
$novoItem = json_decode($input, true);

// Adiciona e salva de volta
$dados[] = $novoItem;
file_put_contents($arquivo, json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "Personagem adicionado com sucesso!";
?>
