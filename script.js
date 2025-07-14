// 防犯機器 修理不能証明書作成ツール - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM要素取得
    const form = document.getElementById('damageForm');
    const previewBtn = document.getElementById('previewBtn');
    const generateBtn = document.getElementById('generateBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const previewSection = document.getElementById('previewSection');
    const certificatePreview = document.getElementById('certificatePreview');
    const damagedPartCheckboxes = document.querySelectorAll('input[name="damagedParts"]');
    const otherPartRow = document.getElementById('otherPartRow');
    const equipmentNameSelect = document.getElementById('equipmentName');
    const otherEquipmentRow = document.getElementById('otherEquipmentRow');
    const issuerSelect = document.getElementById('issuer');
    const otherIssuerRow = document.getElementById('otherIssuerRow');

    // 機器名称の「その他」選択時の表示切り替え
    if (equipmentNameSelect) {
        equipmentNameSelect.addEventListener('change', function() {
            if (this.value === 'その他') {
                otherEquipmentRow.style.display = 'block';
                document.getElementById('otherEquipment').required = true;
            } else {
                otherEquipmentRow.style.display = 'none';
                document.getElementById('otherEquipment').required = false;
                document.getElementById('otherEquipment').value = '';
            }
        });
    }

    // 発行者の「その他」選択時の表示切り替え
    if (issuerSelect) {
        issuerSelect.addEventListener('change', function() {
            if (this.value === 'その他') {
                otherIssuerRow.style.display = 'block';
                document.getElementById('otherIssuer').required = true;
            } else {
                otherIssuerRow.style.display = 'none';
                document.getElementById('otherIssuer').required = false;
                document.getElementById('otherIssuer').value = '';
            }
        });
    }

    // 損傷部位の「その他」選択時の表示切り替え
    damagedPartCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const isOtherChecked = document.querySelector('input[name="damagedParts"][value="その他"]').checked;
            if (isOtherChecked) {
                otherPartRow.style.display = 'block';
                document.getElementById('otherDamagedPart').required = true;
            } else {
                otherPartRow.style.display = 'none';
                document.getElementById('otherDamagedPart').required = false;
                document.getElementById('otherDamagedPart').value = '';
            }
        });
    });

    // プレビューボタンクリック
    previewBtn.addEventListener('click', function() {
        if (validateForm()) {
            generateCertificatePreview();
            previewSection.style.display = 'block';
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // プレビューボタンクリック
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            if (validateForm()) {
                generateCertificatePreview();
                previewSection.style.display = 'block';
                previewSection.scrollIntoView({ behavior: 'smooth' });
                showMessage('プレビューを表示しました。', 'success');
            }
        });
    }
    
    // 証明書生成ボタンクリック
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            if (validateForm()) {
                generateCertificatePreview();
                previewSection.style.display = 'block';
                pdfBtn.disabled = false;
                previewSection.scrollIntoView({ behavior: 'smooth' });
                
                // 成功メッセージ表示
                showMessage('証明書を生成しました。PDF出力が可能になりました。', 'success');
            }
        });
    }

    // PDF出力ボタンクリック
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            if (!pdfBtn.disabled) {
                generatePDF();
            }
        });
    }

    // フォームバリデーション
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        // 既存のエラーメッセージを削除
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                showFieldError(field, 'この項目は必須です');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // 損傷部位チェックボックスの検証
        const damagedParts = document.querySelectorAll('input[name="damagedParts"]:checked');
        if (damagedParts.length === 0) {
            showMessage('少なくとも1つの損傷部位を選択してください。', 'error');
            isValid = false;
        }

        // 症状チェックボックスの検証
        const symptoms = document.querySelectorAll('input[name="symptoms"]:checked');
        if (symptoms.length === 0) {
            showMessage('少なくとも1つの故障症状を選択してください。', 'error');
            isValid = false;
        }

        // 発行者の「その他」選択時の入力チェック
        const issuerSelect = document.getElementById('issuer');
        const otherIssuerInput = document.getElementById('otherIssuer');
        if (issuerSelect && issuerSelect.value === 'その他' && (!otherIssuerInput.value || !otherIssuerInput.value.trim())) {
            otherIssuerInput.classList.add('error');
            showFieldError(otherIssuerInput, '発行者名を入力してください');
            isValid = false;
        }

        return isValid;
    }

    // フィールドエラー表示
    function showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // メッセージ表示
    function showMessage(message, type = 'info') {
        // 既存のメッセージを削除
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ${type === 'success' ? 'background-color: #27ae60;' : ''}
            ${type === 'error' ? 'background-color: #e74c3c;' : ''}
            ${type === 'info' ? 'background-color: #3498db;' : ''}
        `;
        
        document.body.appendChild(messageDiv);
        
        // 3秒後に自動削除
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    // バリエーション用のテンプレート配列
    const variations = {
        introduction: [
            '雷撃で損傷を受けた防犯機器の修理ができるかどうか、技術的な観点から詳しく調べさせていただきました。以下に、なぜ修理が難しいのか、その理由をわかりやすく説明いたします。',
            '雷撃による電磁的影響は、防犯機器の電子回路基板上に配置された微細な電子部品群に対して、製造時の設計耐性を大幅に上回る電気的負荷を印加し、不可逆的な構造変化を生じさせる事象として認識されます。',
            '雷撃の発生は、電子回路の動作限界を遥かに上回る異常電圧・電流の瞬間的印加を伴い、特に微細加工技術により製造された防犯機器内部の半導体素子群に致命的な損傷をもたらす現象として位置づけられます。',
            '雷撃による電磁波の強度および持続時間は、防犯機器内部の集積回路が正常動作を維持するための閾値を著しく超過し、半導体材料の結晶格子構造に永続的な変位を生じさせる物理現象として分析されております。',
            '雷撃事象は、電子機器の動作環境として想定される電磁環境の標準的範囲を大きく逸脱し、防犯機器の電子回路網に対して累積的かつ多面的な損傷プロセスを誘発する異常気象現象として評価されます。',
            '雷撃による電磁的影響は、防犯機器の電子回路基板上に配置された微細な電子部品群に対して、製造時の設計耐性を大幅に上回る電気的負荷を印加し、不可逆的な構造変化を生じさせる事象として認識されます。',
            '雷撃の発生は、電子回路の動作限界を遥かに上回る異常電圧・電流の瞬間的印加を伴い、特に微細加工技術により製造された防犯機器内部の半導体素子群に致命的な損傷をもたらす現象として位置づけられます。',
            '雷撃による電磁波の強度および持続時間は、防犯機器内部の集積回路が正常動作を維持するための閾値を著しく超過し、半導体材料の結晶格子構造に永続的な変位を生じさせる物理現象として分析されております。',
            '雷撃事象は、電子機器の動作環境として想定される電磁環境の標準的範囲を大きく逸脱し、防犯機器の電子回路網に対して累積的かつ多面的な損傷プロセスを誘発する異常気象現象として評価されます。',
            '雷撃による電磁的影響は、防犯機器の電子回路基板上に配置された微細な電子部品群に対して、製造時の設計耐性を大幅に上回る電気的負荷を印加し、不可逆的な構造変化を生じさせる事象として認識されます。',
            '${formatDate(data.incidentDate)}における${data.damageCause}の電気的特性は、防犯機器に搭載された電子部品の絶縁耐圧および通電容量の設計限界を瞬時に突破し、回路基板全体にわたって連鎖的な機能停止状態を引き起こす高エネルギー現象として位置付けられております。',
            '${formatDate(data.incidentDate)}に発生した${data.damageCause}による電磁界の急激な変動は、防犯機器内部の精密電子回路において誘導電流および過渡電圧を発生させ、各構成素子の電気的特性を製造仕様から大幅に逸脱させる破壊的影響を与えたものと判断されます。',
            '${formatDate(data.incidentDate)}の${data.damageCause}現象に伴う電磁パルスの強度分布は、防犯機器の回路設計において前提とされた電磁両立性の基準値を数桁上回る規模であり、電子部品レベルでの原子間結合に影響を及ぼす物理的破壊力を有していたものと分析されております。',
            '${formatDate(data.incidentDate)}に観察された${data.damageCause}事象における電気的放電現象は、防犯機器の電子回路基板上の導体パターンおよび絶縁材料に対して、通常の動作環境では発生し得ない極端な熱的・電気的ストレスを瞬間的に印加し、材料物性の根本的変質を引き起こしたものと評価されます。'
        ],
        technicalAnalysis: [
            '上記症状群は、${data.damageCause}による過電圧および瞬間的な大電流の印加により、機器内部の半導体素子、集積回路、および電子部品に不可逆的な物理的・化学的変化が生じたことを強く示唆しております。',
            '記載された機能障害の発現パターンは、${data.damageCause}に起因する急激な電位変動が回路内の能動素子および受動素子双方に構造的破綻を生じさせた典型的な事例として解析されます。',
            '観察された故障現象の組み合わせは、${data.damageCause}による電磁パルスが電子回路の動作基盤を根本的に変化させ、製造時に設定された電気的特性を永続的に失わせた状態を如実に表しております。',
            '現在確認されている機能不全の各項目は、${data.damageCause}の強大な電磁エネルギーが電子回路網全体に及ぼした統合的損傷の結果として発現したものであり、個別の部品故障ではなくシステムレベルの総合故障として理解されます。',
            '本件で観測された一連の故障現象は、${data.damageCause}に起因する電磁放電が電子部品内部の結晶構造とエネルギーバンド構成に永続的な変化を与えた物理的破壊の明確な証拠として認識されております。',
            '故障症状の発生パターンおよびその組み合わせは、${data.damageCause}による瞬間的なエネルギー放出が電子回路基板上の複数の機能ブロックに同時的に影響を及ぼした結果であり、単一部品の独立故障ではなくシステム全体の協調動作障害として評価されます。',
            '確認された機能失調の各項目は、${data.damageCause}の電磁波が電子機器の設計上の耐電磁ノイズ性能を大幅に上回る強度であったことを物語っており、回路設計者が想定した電磁互換性の範囲を遥かに超えた異常現象であったことを示しております。',
            '上記の機能異常群は、${data.damageCause}によって発生した過渡電圧および誘導電流が、電子部品の動作点を安定領域から非線形領域または破壊領域へと移行させた物理現象として理解され、これは電子工学の理論において不可逆的損傷の典型例として位置付けられています。',
            '記載された各種故障症状の相互関連性および同時発生性は、${data.damageCause}の電磁エネルギーが電子回路全体に一様に分布した結果として解釈され、局所的な損傷ではなく機器全体の電気的性能が総合的に変質した状態を明確に示しております。',
            '本件における故障現象の特徴的な発現形態は、${data.damageCause}に起因する電磁界の急激な変動が、電子部品の各構成層において階層的な破壊を進行させた結果であり、これは材料工学的観点から最も修復困難な損傷タイプとして分類されております。'
        ],
        repairImpossibility: [
            '雷撃による瞬間的な高電圧・大電流の印加により、半導体接合部の物理的破壊、金属配線の溶断、絶縁材料の炭化等の不可逆的な損傷が発生しており、これらは製造時の精密な工程によってのみ形成可能な構造であるため、現場での修復は技術的に不可能であります。',
            '電磁的衝撃による原子レベルでの結晶構造の破綛、導電路の分子間結合の切断、および誘電体材料の組成変化等、ナノスケールでの不可逆的変質が広範囲に発生しており、これらの損傷は工場での精密制御環境下でのみ修復可能な性質のものであります。',
            '高エネルギー電磁パルスによる電子材料の格子欠陥形成、金属間化合物の相変化、および高分子材料の架橋構造破壊等、材料科学的観点から修復不可能な変質が多層的に進行しており、従来の修理技術では対応不可能な状態にあります。',
            '電子部品内部のマイクロ回路において、電気・熟ストレスによるアルミニウム配線のエレクトロマイグレーション、シリコン基板の格子欠陥形成、および酷化膨絶縁層の絶縁破壊等の物理的変化が同時多発的に発生しており、これらは半導体製造プロセスでのみ再生可能な精密構造であるため、一般的な修理手法での対応は物理的に不可能であります。',
            '電磁パルスの衝撃で発生したジュール熱による回路基板の層間剥離、ビアホール内の銅めっき蒸発、およびFR-4基板材料の熱分解と炭素化等の点から、本来の酒気的・機械的強度が失われた状態であり、これらの多層構造の再構築は製造工場のクリーンルーム環境および特殊装置でのみ実現可能であり、修理現場での復旧は原理的に不可能であります。',
            '瞬間的な過電流によるボンディングワイヤーの融断、チップ内部のメタライゼーション層の溶失、およびモールド樹脂の熱分解等の物理変化が複合的に進行しており、これらの損傷は半導体パッケージング技術の精密度および特殊材料の性質に依存した構造であるため、従来の電子機器修理技術では復元できない損傷レベルにあります。',
            '電磁放電現象によるシリコン酵化膜の絶縁破壊、ポリシリコン保護膜の炭化、およびアルミニウム配線のスパイク・ヒロック現象等の電気化学的反応が連鎖的に発生し、回路基板の多層構造全体で导電性および絶縁性の永続的失敗が発生しており、これらの分子レベルの化学的変化は現在の簡易修理技術では逆転不可能であります。',
            '電子部品の接合部で発生したエレクトロマイグレーション、コロージョン、およびデンドライト成長等の現象による結晶粒界の破壊、不純物の拡散、およびキャリア濃度の空間分布変化等が進行してお、これらの物性変化は半導体物理学の原理に基づく不可逆反応であり、一度発生した損傷の元の状態への完全な復元は学術的に不可能であります。',
            '結晶粒界および異相界面での原子間結合の不可逆的破壊、ドーパント原子の異常拡散、および格子完全性の局所的欠陥形成等の原子スケールでの物質性変化が広範囲に発生しており、これらの物理現象は現在の材料科学技術でも原理的に修復不可能なレベルの構造破壊であも、特に工場外環境での修復作業は物理学的に非現実的と言わざるを得ません。'
        ],
        systemIntegration: [
            '現代の防犯機器は高度に統合されたシステムアーキテクチャを採用しており、一つの機能ブロックの損傷が全体の動作に影響を及ぼす設計となっているため、部分的な修理では元来の性能と信頼性を回復することは困難であります。',
            '当該機器の設計思想は、各構成要素間の密接な相互依存関係に基づく統合的動作を前提としており、一部分の機能回復を図ったとしても、システム全体としての協調動作および信頼性保証は達成不可能な状況にあります。',
            '本機器に採用されているモジュラー統合設計においては、個別コンポーネントの修復が仮に可能であったとしても、システム全体の動作安定性および長期信頼性の維持には、全構成要素の電気的・機械的整合性が不可欠であり、部分修理では要求仕様を満たすことができません。',
            '電子回路基板上の各機能ブロック間のタイミング同期、電源電圧の分配平衡、およびクロック信号の位相関係等は、製造時の精密な回路設計および部品選定によって初めて達成される綾密なバランスであり、一部部品の置換ではこの電気的平衡を完全に再現することは実質的に不可能であります。',
            '統合セキュリティ機器の信号処理アルゴリズムは、ハードウェアとソフトウェアの协調動作によって初めて所定の性能を発揮するように設計されており、ハードウェア層での損傷はソフトウェアの正常動作を妨げるだけでなく、システム全体のセキュリティ機能および信頼性を根本的に失わせる結果をもたらします。',
            'マルチレイヤーネットワークプロトコルとリアルタイム信号処理の統合システムである本機器においては、ハードウェアレベルの電気的特性変化が通信プロトコルのエラー率、タイミング精度、およびデータ整合性に直接影響し、一部修復では全体的なネットワーク性能の保証ができません。',
            'アナログ回路とデジタル回路のハイブリッド構成において、アナログ部の電気的特性変化はデジタルシグナルの品質、A/D変換精度、およびノイズフロアに予測不可能な影響を与えるため、個別部品の置換ではシステム全体の信号品質を元の状態に復元することは実用上不可能であります。',
            'ファームウェアとハードウェアの緊密な統合によって実現されるセキュリティ機能において、ハードウェアの物理的損傷はセキュリティアルゴリズムの実行環境を不安定化させ、仮に一部部品を交換したとしても、セキュリティレベルの保証および攻撃耐性の復元は統合システム全体の再設計なしには達成不可能であります。',
            '最新の防犯機器における適応型アルゴリズムと機械学習機能は、ハードウェアの電気的特性とソフトウェアのパラメータ最適化が統合的に連携して動作するように設計されており、ハードウェアの物理的変化はこれらの適応機能を永続的に停止させ、部分修理ではシステム全体の知的機能を復元することは基本的に不可能であります。'
        ],
        safetyReliability: [
            '修理を実施したとしても、目に見えない微細な損傷や劣化が残存する可能性があり、将来的な予期せぬ故障や安全上の問題を完全に排除することができないため、防犯という重要な用途において要求される高い信頼性基準を満たすことは不可能であります。',
            '仮に表面的な機能回復を達成したとしても、内在する潜在的欠陥や材料特性の経年劣化加速要因を完全に除去することは技術的に不可能であり、防犯システムに求められる長期安定動作および緊急時確実動作の保証を提供することができません。',
            '修理による機能復旧を行った場合であっても、電気的ストレス履歴による材料疲労の蓄積や、微視的損傷による故障率の統計的増加は不可避であり、防犯用途における要求信頼度を継続的に維持することは実現困難な状況にあります。',
            '電磁衝撃を受けた後の電子部品においては、結晶粒界の化学的変化、不純物原子の再分布、および異相界面のエネルギー状態変化等の材料物性改変が永続的に進行し続けるため、一度損傷を受けた部品の長期信頼性は原理的に保証できません。',
            '電子部品の内部構造において、一度発生したクラックや空洞は、温度サイクル、機械的振動、および電気的ストレスの終返し作用によって進行性に拡大する物理的性質を有し、たとえ一時的な機能復旧が達成されても、長期的な使用においては予測不可能なタイミングでの突発的故障リスクが存在します。',
            '電気的ストレスを経験した絶縁材料においては、分子レベルでの架橋構造の破壊、極性基の配向変化、および絶縁性能の空間的不均一化等が生じ、これらの化学的変化は環境温度、湿度、および電磁界変動に対する永続的な不安定性をもたらし、セキュリティ機器に求められる絶対的信頼性を実現できません。',
            '電子部品の接合部やはんだ部で発生した金属間化合物の相変化、拡散層の形成、およびエレクトロマイグレーションの加速化等の現象は、電気的接続の信頼性を永続的に低下させる要因となり、防犯システムのライフサイクルで求められる25年間の無故障動作保証を実現することは実質的に不可能であります。',
            '緊急時における防犯機器の確実動作には、通常状態と異なる温度・湿度・電源条件での安定動作が不可欠であり、電磁的損傷を受けた部品の特性バラツキおよび温度依存性の変化は、これらの極限状況での動作保証を根本的に困難にし、人命や財産を守る重要な場面での突発的機能停止リスクを完全に除去できません。',
            'セキュリティシステムのライフサイクル設計において、初期故障率の統計的予測、中間期の安定動作期間、および末期の摩耗故障率は、全て新品で未使用の部品を前提とした計算モデルに基づいており、一度電気的ダメージを受けた部品の信頼性曲線はこれらの統計モデルから完全に逸脱し、緊急時の空陽確率を定量的に予測することが不可能となります。',
            '製品責任法および保安基準法の適用観点から、修理された防犯機器が将来的に引き起こす可能性のある物的损害、防犯機能の空白期間による盗難、および囤住者の安全保証等の方面で発生する法的リスクは、組織として許容可能なレベルを超えており、適切なリスク管理の観点から修理対応を実施することは実務上不可能であります。'
        ],
    };

    // ランダム選択関数
    function getRandomVariation(category) {
        const options = variations[category];
        return options[Math.floor(Math.random() * options.length)];
    }

    // 証明書プレビュー生成
    function generateCertificatePreview() {
        const formData = new FormData(form);
        const data = {};
        
        // フォームデータ収集
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }

        // 症状データ収集
        const symptoms = [];
        document.querySelectorAll('input[name="symptoms"]:checked').forEach(checkbox => {
            symptoms.push(checkbox.value);
        });

        // 損傷部位データ収集
        const damagedParts = [];
        document.querySelectorAll('input[name="damagedParts"]:checked').forEach(checkbox => {
            if (checkbox.value === 'その他' && data.otherDamagedPart) {
                damagedParts.push(data.otherDamagedPart);
            } else {
                damagedParts.push(checkbox.value);
            }
        });
        
        // 損傷部位の表示用文字列作成
        let displayDamagedParts = damagedParts.slice(0, 3).join('、');
        if (damagedParts.length > 3) {
            displayDamagedParts += '等';
        }

        // 証明書HTML生成
        const certificateHTML = `
            <div class="cert-header">
                <div>証明書番号: CERT-${generateCertificateNumber()}</div>
                <div>発行日: ${new Date().toLocaleDateString('ja-JP')}</div>
            </div>
            
            <h1>修理不能証明書</h1>
            
            <div class="cert-content">
                <div class="cert-section">
                    <h3>事故概要・機器情報</h3>
                    <div class="cert-item">
                        <div class="cert-label">事故発生日:</div>
                        <div class="cert-value">${formatDate(data.incidentDate)}</div>
                    </div>
                    <div class="cert-item">
                        <div class="cert-label">損傷原因:</div>
                        <div class="cert-value">${data.damageCause || '未記載'}</div>
                    </div>
                    <div class="cert-item">
                        <div class="cert-label">機器名称:</div>
                        <div class="cert-value">${data.equipmentName === 'その他' && data.otherEquipment ? data.otherEquipment : data.equipmentName}</div>
                    </div>
                    <div class="cert-item">
                        <div class="cert-label">品番:</div>
                        <div class="cert-value">${data.equipmentModel || '未記載'}</div>
                    </div>
                    <div class="cert-item">
                        <div class="cert-label">S/N:</div>
                        <div class="cert-value">${data.equipmentNumber || '未記載'}</div>
                    </div>
                </div>

                <div class="cert-section">
                    <h3>損傷・診断結果</h3>
                    <div class="cert-item">
                        <div class="cert-label">損傷箇所:</div>
                        <div class="cert-value">${displayDamagedParts}</div>
                    </div>
                    <div class="cert-item">
                        <div class="cert-label">主な症状:</div>
                        <div class="cert-value">
                            ${symptoms.length > 0 ? symptoms.slice(0, 3).join('、') : '未選択'}${symptoms.length > 3 ? '等' : ''}
                            ${data.additionalSymptoms ? ' 他' : ''}
                        </div>
                    </div>
                    <div class="cert-item">
                        <div class="cert-label">診断結果:</div>
                        <div class="cert-value"><strong>${data.repairability}</strong></div>
                    </div>
                </div>

                <div class="cert-section">
                    <h3>証明内容</h3>
                    <div class="cert-item">
                        <div class="cert-value">
                            <strong>【事故発生状況及び損傷機序に関する技術的分析】</strong><br><br>
                            
                            ${eval('`' + getRandomVariation('introduction') + '`')}<br><br>
                            
                            本件対象機器「${data.equipmentName}」（${data.equipmentModel || '型式不明'}）について、専門技術者による詳細な損傷状況調査を実施した結果、
                            ${displayDamagedParts}において以下に示す重篤な機能障害及び物理的損傷が確認されました。<br><br>
                            
                            <strong>【確認された具体的故障症状】</strong><br>
                            ${symptoms.map((symptom, index) => `${index + 1}. ${symptom}`).join('<br>')}
                            ${data.additionalSymptoms ? '<br>追加症状: ' + data.additionalSymptoms : ''}<br><br>
                            
                            <strong>【技術的診断根拠】</strong><br>
                            ${eval('`' + getRandomVariation('technicalAnalysis') + '`')}特に、現代の防犯機器で使用される
                            高密度実装された電子回路においては、一箇所の損傷が連鎖的に他の回路部分に波及し、システム全体の機能不全を
                            引き起こす構造的特性を有しているため、部分的な修理では根本的な解決に至らないことが技術的に明らかであります。<br><br>
                            
                            <strong>【修理不能性の論理的根拠】</strong><br>
                            当該機器の現在の状態を総合的に検証した結果、以下の技術的理由により修理不能と判定いたします：<br><br>
                            
                            1. <strong>電子回路の不可逆的損傷</strong>：${eval('`' + getRandomVariation('repairImpossibility') + '`')}<br><br>
                            
                            2. <strong>システム統合性の喪失</strong>：${eval('`' + getRandomVariation('systemIntegration') + '`')}<br><br>
                            
                            3. <strong>安全性及び信頼性の担保困難</strong>：${eval('`' + getRandomVariation('safetyReliability') + '`')}<br><br>
                            
                            <strong>【最終的な技術的結論】</strong><br>
                            以上の技術的分析に基づき、専門技術者としての見解により、本機器は<strong>「${data.repairability}」</strong>であると確定的に判定いたします。
                            ${data.repairNotes ? 'なお、' + data.repairNotes.replace(/\n/g, '<br>') + '<br><br>' : ''}
                            
                            従いまして、本証明書をもって、当該防犯機器の修理が技術的・経済的・安全性の観点から実行不可能であることを、
                            専門技術者の責任において証明いたします。
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="cert-footer">
                <div style="margin-top: 40px;">
                    <div>発行者: ${data.issuer === 'その他' && data.otherIssuer ? data.otherIssuer : data.issuer}</div>
                    <div style="margin-top: 20px;">証明者: ___________________________</div>
                    <div style="margin-top: 20px;">所属・役職: ___________________________</div>
                    <div style="margin-top: 20px;">署名・捺印: ___________________________</div>
                </div>
            </div>
        `;

        certificatePreview.innerHTML = certificateHTML;
    }

    // 証明書番号生成
    function generateCertificateNumber() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${year}${month}${day}-${random}`;
    }

    // 日付フォーマット
    function formatDate(dateString) {
        if (!dateString) return '未記載';
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // PDF生成
    function generatePDF() {
        console.log('PDF生成開始');
        
        // 証明書のプレビューが存在するか確認
        if (!certificatePreview || certificatePreview.innerHTML.trim() === '') {
            showMessage('証明書を先に生成してください。', 'error');
            return;
        }
        
        // シンプルなPDF生成
        try {
            // 証明書領域を時的に表示して印刷用スタイルを適用
            previewSection.style.display = 'block';
            
            // 印刷用CSSを動的に追加
            const printStyle = document.createElement('style');
            printStyle.textContent = `
                @media print {
                    body * { visibility: hidden; }
                    #previewSection, #previewSection * { visibility: visible; }
                    #previewSection { position: absolute; left: 0; top: 0; width: 100%; }
                    .cert-header { font-size: 12px; }
                    .cert-content { font-size: 14px; }
                    .cert-footer { font-size: 12px; }
                }
            `;
            document.head.appendChild(printStyle);
            
            // 印刷ダイアログを開く
            setTimeout(() => {
                window.print();
                // 印刷用スタイルを削除
                document.head.removeChild(printStyle);
                showMessage('印刷ダイアログを開きました。PDFとして保存してください。', 'success');
            }, 500);
            
        } catch (error) {
            console.error('PDF生成エラー:', error);
            window.print();
        }
    }

    // 初期化
    function init() {
        // 今日の日付を事故発生日のデフォルト値に設定
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('incidentDate').value = today;
        
        // フォーム送信を無効化
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
        
        console.log('防犯機器修理不能証明書作成ツール - 初期化完了');
    }

    // 初期化実行
    init();
});

// ページロード完了時の処理
window.addEventListener('load', function() {
    // jsPDFライブラリの動的読み込み
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = function() {
        console.log('jsPDF ライブラリが読み込まれました');
    };
    script.onerror = function() {
        console.log('jsPDF ライブラリの読み込みに失敗しました - 印刷機能を使用');
    };
    document.head.appendChild(script);
});

// 編集機能の初期化
function initEditFunctionality() {
    const editBtn = document.getElementById('editBtn');
    const finalPdfBtn = document.getElementById('finalPdfBtn');
    const editSection = document.getElementById('editSection');
    const certificateEditor = document.getElementById('certificateEditor');
    const updatePreviewBtn = document.getElementById('updatePreviewBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const previewSection = document.getElementById('previewSection');
    const certificatePreview = document.getElementById('certificatePreview');
    
    let originalPreviewContent = '';
    
    // 編集ボタンのクリックイベント
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            if (certificatePreview && certificatePreview.innerHTML.trim() !== '') {
                // 現在のプレビュー内容をHTMLとして保存
                originalPreviewContent = certificatePreview.innerHTML;
                // HTML内容を編集可能な形式でエディタに設定
                certificateEditor.value = originalPreviewContent;
                
                // プレビューを非表示にし、編集エリアを表示
                previewSection.style.display = 'none';
                editSection.style.display = 'block';
                certificateEditor.focus();
            } else {
                alert('まず証明書を生成してください。');
            }
        });
    }
    
    // プレビュー更新ボタンのクリックイベント
    if (updatePreviewBtn) {
        updatePreviewBtn.addEventListener('click', function() {
            const editedContent = certificateEditor.value;
            if (editedContent.trim() !== '') {
                // 編集されたHTMLをそのままプレビューに表示
                certificatePreview.innerHTML = editedContent;
                
                // 編集エリアを非表示にし、プレビューを表示
                editSection.style.display = 'none';
                previewSection.style.display = 'block';
                
                // スクロールしてプレビューを表示
                previewSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert('編集内容が空です。');
            }
        });
    }
    
    // 編集キャンセルボタンのクリックイベント
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            // 元のプレビュー内容を復元
            if (originalPreviewContent) {
                certificatePreview.innerHTML = originalPreviewContent;
            }
            
            // 編集エリアを非表示にし、プレビューを表示
            editSection.style.display = 'none';
            previewSection.style.display = 'block';
        });
    }
    
    // 最終PDF出力ボタンのクリックイベント
    if (finalPdfBtn) {
        finalPdfBtn.addEventListener('click', function() {
            if (certificatePreview && certificatePreview.innerHTML.trim() !== '') {
                // 印刷ダイアログを開く
                window.print();
            } else {
                alert('証明書を先に生成してください。');
            }
        });
    }
}

// テキストをHTMLに変換する関数
function formatTextToHTML(text) {
    return text
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/【([^】]+)】/g, '<strong>$1</strong>')
        .replace(/●/g, '•')
        .replace(/■/g, '▪');
}

// ページ読み込み完了時に編集機能を初期化
document.addEventListener('DOMContentLoaded', function() {
    // 少し遅延して初期化する（他の初期化が完了した後）
    setTimeout(initEditFunctionality, 100);
});
