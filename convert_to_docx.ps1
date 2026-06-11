try {
    Write-Host "Iniciando la conversión de HTML a DOCX usando Word..."
    $htmlPath = "c:\Users\alfro\Desktop\RG\Defensa_Inteligencia_de_Negocios.html"
    $docxPath = "c:\Users\alfro\Desktop\Defensa_Inteligencia_de_Negocios.docx"
    
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open($htmlPath)
    # 16 es wdFormatDocumentDefault (docx)
    $doc.SaveAs($docxPath, 16)
    $doc.Close()
    $word.Quit()
    
    Write-Host "Éxito: Archivo DOCX creado exitosamente en $docxPath"
} catch {
    Write-Error "No se pudo utilizar Word COM Object. Error: $_"
}
