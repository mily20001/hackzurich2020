import os, sys, logging, traceback, codecs, datetime, copy, time, ast, math, re, random, shutil, json
import soton_corenlppy, geoparsepy


LOG_FORMAT = ('%(message)s')
logger = logging.getLogger( __name__ )
logging.basicConfig( level=logging.INFO, format=LOG_FORMAT )
logger.info('logging started')

dictGeospatialConfig = geoparsepy.geo_parse_lib.get_geoparse_config( 
	lang_codes = ['de'],
	logger = logger,
	whitespace = u'"\u201a\u201b\u201c\u201d()',
	sent_token_seps = ['\n','\r\n', '\f', u'\u2026'],
	punctuation = """,;\/:+-#~&*=!?""",
	)

databaseHandle = soton_corenlppy.PostgresqlHandler.PostgresqlHandler( 'postgres', 'postgres', 'localhost', 5432, 'openstreetmap', 600 )

dictLocationIDs = {}
listFocusArea=[ 'global_cities', 'europe_places' ]
for strFocusArea in listFocusArea :
	dictLocationIDs[strFocusArea + '_admin'] = [-1,-1]
	dictLocationIDs[strFocusArea + '_poly'] = [-1,-1]
	dictLocationIDs[strFocusArea + '_line'] = [-1,-1]
	dictLocationIDs[strFocusArea + '_point'] = [-1,-1]

cached_locations = geoparsepy.geo_preprocess_lib.cache_preprocessed_locations( databaseHandle, dictLocationIDs, 'public', dictGeospatialConfig )
logger.info( 'number of cached locations = ' + str(len(cached_locations)) )

databaseHandle.close()

indexed_locations = geoparsepy.geo_parse_lib.calc_inverted_index( cached_locations, dictGeospatialConfig )
logger.info( 'number of indexed phrases = ' + str(len(indexed_locations.keys())) )

indexed_geoms = geoparsepy.geo_parse_lib.calc_geom_index( cached_locations )
logger.info( 'number of indexed geoms = ' + str(len(indexed_geoms.keys())) )

osmid_lookup = geoparsepy.geo_parse_lib.calc_osmid_lookup( cached_locations )

dictGeomResultsCache = {}

processed = 0

for filename in os.listdir('data_json'):
    with open("data_json/" + filename, 'r', encoding='utf-8') as f:
        jsondata = json.load(f)
        
    
    
    for i in range(len(jsondata)):
        processed += 1

        listText = []
        listText.append(jsondata[i]["title"])
        listText.append(jsondata[i]["text"])
        
        jsondata[i]["Location"] = []
    
        #listText = [
        #	u'«Die welteste Brass-Oper von Manuel Renggli nach der gleichnamigen Geschichte von Michael Fehr»: Nichts weniger verspricht die Produktion «Dschungel», die am Luzerner Theater uraufgeführt wird.«Dschungel» ist eine Geschichte des Erzählers Michael Fehr. Fehr hat sich einen Namen als eigenwilliger Dichter und Spoken-Word-Künstler mit einer prägnanten Sprache gemacht. Seit ein paar Jahren tritt er auch mit einer Band auf, mit der er seine Geschichten zu Songs entwickelt. Dass nun sein Erzählstoff «Dschungel» für ein Libretto für eine Brass-Oper adaptiert wurde, aktiviert die Erwartungen an den innovativen Geist des Luzerner Theaters.Fehrs «Dschungel» erzählt die Geschichte des Mädchens Brahma, das von seiner alkoholkranken Mutter vernachlässigt wird. Auf der Suche nach etwas Essbarem schnappt es sich von ein paar Jungs auf der Strasse ein paar Pillen. Es beginnt eine halluzinatorische Reise in den Dschungel, wo Brahma Erlebnisse mit verschiedenen Tieren hat. Die Geschichte und auch die Inszenierung sind so angelegt, dass sich Realität und Traum vermischen. Was ist draussen, was ist drinnen? Ist Brahma wirklich im Dschungel und begegnet den Tieren, oder spiegeln sich in ihrem Innern verschiedene Facetten ihrer Persönlichkeit?Nichts VergleichbaresEine besondere Herausforderung bedeutet dieses Stück für den Komponisten Manuel Renggli. Der gebürtige Entlebucher, der nach seinem Dirigentenstudium in Bern ein zweites Studium der Germanistik und Musikwissenschaft absolviert, ist ein grosses Talent. Er hat schon Werke für Brassband, Klavier, Streichorchester, Sinfonisches Blasorchester, Sinfonieorchester, aber auch für unkonventionelle Besetzungen geschrieben. Doch ein grosses Werk wie eine Oper hat er noch nie angepackt. Schon gar nicht eine Brass-Oper.«Es gibt nichts Vergleichbares, an dem ich mich hätte orientieren können», sagt Renggli. 2018 war er an der Universität Bern als Tutor im Bereich Oper engagiert. Aber mit dem «Dschungel» stellten sich ganz neue Aufgaben. «Eine grosse Herausforderung bei einer Brass-Oper ist es, die Sängerinnen und Sänger mit der Brassband abzustimmen, damit Stimme und Text verständlich bleiben.» 28 Blechbläser können sehr laut sein. Handkehrum würde die Blechmusik ihren spezifischen Charakter verlieren, wenn sie nur gedämpft und pianissimo daherkäme.Brass und SynthesizerDoch Renggli kennt die modernen Brassbands. «Ihre Soundkultur ist geprägt von den Contests, wo sich die Ensembles messen. Eine Brassband ist sehr offen und flexibel. Ihre grosse Präzision erlaubt ein wendiges und hochdynamisches Musizieren. Sie kann im Nu Stimmungswechsel vollziehen.» Von diesen Charakteristiken sei er ausgegangen, und sie passten auch zum Text von Fehr, sagt Renggli. Auch der Rhythmus ist für ihn ein wichtiges Element. Wenn schon ein Novum, dann richtig, mag sich der Komponist gesagt haben, als er sich entschloss, zum Brassklang der Bürgermusik noch einen Synthesizer hinzuzufügen. Nicht als farbiger oder dissonanter Kontrapunkt zum Brassklang, sondern als Erweiterung und Vertiefung desselben, als Verschmelzung und Synthese. «Ich kann mit dem Synthesizer mehr Frequenzen in den Brassklang bringen, ihn ausweiten und grösser machen.» Mit dieser Kombination kann Renggli auch längere Spannungsbögen erzeugen oder den stellenweise psychedelischen Charakter des Stücks unterstützen.Musikalisch lässt Renggli auch populäre Stilrichtungen wie Hip-Hop oder Heavy Metal in das Werk einfliessen. «Eine Brassband kann wie ein Chamäleon diverse Stilarten annehmen und verwandeln.» Geschrieben hat er die gut 70-minütige Komposition nicht am Computer, sondern mit Bleistift und Papier. «So kann ich das Werk besser memorieren und dadurch die grossen Bögen besser ausarbeiten, das ist mir extrem wichtig.» Er habe das Werk inzwischen wirklich praktisch Note für Note im Kopf, sagt Renggli und grinst. «Ich träume sogar davon.»Pirmin BossartPremiere: Samstag, 8. Februar, 19.30Luzerner Theater, Luzern. Bis 3. April; Infos/VV: www.luzernertheater.ch/dschungel.Ist Brahma wirklich im Dschungel, oder spiegeln sich in ihrem Innern verschiedene Facetten ihrer Persönlichkeit?Probenbilder: Ingo Höhn/PD«Eine Brassband kann wie ein Chamäleon diverse Stilarten annehmen und verwandeln.»Manuel Renggli,KomponistDer Regisseur Tom Ryser – Spezialist für KnacknüsseTom Ryser, Sie wurden vom Luzerner Theater für die Regie dieser Brass-Oper angefragt. Was hat Sie daran gereizt?Tom Ryser: Ich werde gerne gefragt für Projekte, bei denen man noch nicht klar weiss, wie der Prozess funktioniert und wie es herauskommt. Das hat mich schon immer interessiert. Eine explizite Oper für Blechinstrumente hat es noch nie gegeben. Niemand weiss, wie das tönt. Es gibt keine vergleichbaren Beispiele.Was sind Ihre Spezialitäten?Ich arbeite gerne spartenübergreifend, wenn sich Schauspiel, Tanz, Musik und andere Künste vermischen. Ich habe schon mal ein Ballett für Baumaschinen gemacht oder zur Eröffnung der Kulturhauptstadt Linz die «Raketensymphonie» für 16 Solisten, Feuerwerk und Chor realisiert. Oder eine Choreografie mit Schiffen und Chören an der Themse, zur Wiedereröffnung der Royal Festival Hall in London.Und jetzt einer Brass-Oper mit einer Michael-Fehr-Geschichte. Wie hat Sie dieser «Dschungel»-Text angesprochen?Ich liebe den Text. Er ist sehr rhythmisiert. Ich mag die Wörter, die Fehr verwendet. Er wählt auch alte Wörter oder spielt mit Wiederholungen. Damit schafft er eine eigene und eigenwillige Welt, die wir versuchen, zu inszenieren. Um eine gute Spur zu finden, haben wir sehr darauf geachtet, was passt. Manchmal haben wir einzelne Passagen weggelassen. Oder wir schufen mit dem Erzähler eine eigene Figur.Die Geschichte klingt nach einem Trip, auf dem das Mädchen Brahma in den Dschungel gerät und dort verschiedensten Tieren begegnet. Wie haben Sie das inszenatorisch gelöst?Das sind eben die Fragen und Situationen, die mich reizen. Da ist beispielsweise von Ameisen die Rede. Wie stelle ich diese Ameisen dar? Ich habe acht Frauen zur Verfügung. Solche Knacknüsse machen Spass. Die Geschichte selber verstehe ich als einen Prozess der Läuterung. Man reist mit dem Mädchen selber immer tiefer in das Geschehen hinein. Am Schluss ist sie ein Mensch geworden, der im Leben selber handeln kann und nicht nur ein Opfer der Umstände ist.Hat der Umstand, dass hier eine Brassband und kein Streichorchester spielt, Ihre szenische Arbeit beeinflusst?Es ist verrückt, wie viele Nuancen eine Brassband ausdrücken kann und was der Blechklang an Dynamik bietet. Auch die Klangteppiche haben andere Farben. Kommt diese Klangkultur mit den klassischen Opernstimmen zusammen, klingt das für Opern gewohnte Ohren sicher mal anders. Als Regisseur habe ich szenisch und choreografisch darauf reagiert, indem ich gewisse Stellen von der Dynamik und Verständlichkeit her angepasst habe.pb',
        #    u'Little WomenGreta Gerwig ist nicht die Erste, die sich des Literaturklassikers von Louisa May Alcott annimmt. Aber mit einem eigenen, sehr persönlichen Zugang zur Geschichte um vier Schwestern, die Mitte des 19. Jahrhunderts ihren eigenen Weg suchen, schafft sie etwas Neues, mit dem sich jede und jeder verbinden kann. Herzerwärmend, lebendig und bei 135 Minuten keine Sekunde langweilig. (Ab 12) regLuzern, Bourbaki (e); Altdorf, Cinema Leuzinger (d); Einsiedeln, Cinéboxx (d); Engelberg, Kino (d); Schwyz, Mythen-Forum (d); Zug, Seehof (e)AdamMaryam Touzani verknüpft in ihrem Kinodebüt die tragischen Schicksale zweier Frauen zu einer einfühlsamen Parabel über (weibliche) Solidarität. In erdigen Farbtönen gehalten und sensationell schön fotografiert, führt der Film ins Innere einer Frauenwelt, die fremden Blicken für gewöhnlich verborgen bleibt – getragen vom starken Spiel der beiden Hauptdarstellerinnen. Ein ausnehmend feinfühliger und beeindruckender Film. (Ab 16) igLuzern, Stattkino (arab)Die Heinzels – Rückkehr der HeinzelmännchenLiebenswerter deutscher Animationsfilm um die flinken und emsigen Helfer im Hintergrund. (Ab 4) dpaAltdorf, Cinema Leuzinger; Emmenbrücke, Maxx; Engelberg, Kino; Schöftland, Cinema 8; Schwyz, Mythen-Forum; Sins, Cinepol; Zug, Seehof (d)Jojo RabbitAls Anti-Hass-Satire stellt der Neuseeländer Taika Waititi seinen Film vor. Es geht um einen zehnjährigen Jungen und seinen imaginären Freund Adolf Hitler. Die Nazi-Farce hat Witz, Wärme und starke Darsteller. (Ab 16) dpaLuzern, Bourbaki (e), Capitol (e); Schwyz, Mythen-Forum (e); Zug, Seehof (e)Lindenberg! Mach dein DingDie Rockbiografie ist unterhaltend, wartet mit überraschend vielen traurig-ernsten Momenten auf und ist gut besetzt. Darüber hinaus erzählt der Film ziemlich überzeugend von der wirklich sehr beeindruckenden Fähigkeit eines Menschen, eines Künstlers, sich gegen alle Widerstände, Wahrscheinlichkeiten und Einwände durchzusetzen und sich als wandelndes Gesamtkunstwerk zu etablieren. (Ab 12) dpaLuzern, Bourbaki (d)PlatzspitzbabyDie Buchvorlage erzählt die Geschichte eines vergessen gegangenen Kindes, dessen Mutter ihr Leben auf dem Zürcher Platzspitz an die Drogen verschenkte. Sarah Spale als Junkie ist eine Wucht. Als Zuschauer fühlt man sich in die Achtziger und Neunziger zurückversetzt, als die offene Drogenszene in den Innenstädten Realität war. Stark ist zudem Luna Mwezi in der zweiten Hauptrolle. (Ab 12) dfuLuzern, Bourbaki+Moderne; Altdorf, Cinema Leuzinger; Einsiedeln, Cinéboxx; Emmenbrücke, Maxx; Schöftland, Cinema 8; Schwyz, Mythen-Forum; Sins, Cinepol; Stans, Afm Cinema; Willisau, Cinebar; Zug, Gotthard (CH-d)Les misérablesMontfermeil, eine Pariser Vorortgemeinde. Der wilde Issa vertreibt sich die Langeweile mit kleinen Diebstählen; der ruhige Buzz beobachtet die Mädchen mit seiner Drohne und filmt zufällig einen Vorfall zwischen Polizei und Jugendlichen, der das Quartier erschüttern wird. Regisseur Ladj Ly skizziert in diesem dichten, rhythmischen und intensiven Thriller und Sozialdrama exemplarisch, wie es zur Gewalteruption in der Banlieue kommen kann. (Ab 14) regLuzern, Bourbaki, Nocturne (f)JudyDas Biopic zeichnet die letzten Monate im Leben von Hollywoodstar Judy Garland, die mit «The Wizard of Oz» weltberühmt wurde. Für ein Engagement in London muss die physisch und psychisch stark angeschlagene Sängerin ihre Kinder dem Ex-Mann überlassen. Wenn auch zu affektiert, ist Renée Zellwegers Spiel einnehmend und weckt Sympathie und Empathie. (Ab 12) regLuzern, Bourbaki, am Sonntag (e)Knives OutPatriarch und Krimiautor Harlan Thrombey wird in seinem abgelegenen Landhaus tot aufgefunden. Wer ist’s gewesen? Benoit Blanc (Daniel Craig) macht sich im Stil von Hercule Poirot an die Aufklärung. Ein Mordsspass von Rian Johnson, und das herausragende Ensemble ist mit ebensolchem bei der Sache. (Ab 8/14) regLuzern, Bourbaki (e)+Capitol (d); Schwyz, Mythen-Forum (d); Zug, Seehof (e)Frozen II (Die Eiskönigin II)Mit ausgefeilten Computersequenzen und viel Liebe zum Detail führt die Fortsetzung in eine spektakuläre Welt mit bunten Wäldern und düsteren Abgründen. Disney setzt auf Frauenpower und Tiefgang, wenn Elsa mutig ihre Herkunft erforscht. Doch an anderer Stelle drehen die Macher mit lauten Songs und heiteren Einlagen ordentlich auf. (Ab 6) dpaEmmenbrücke, Maxx; Schöftland, Cinema 8; Schwyz, Mythen-Forum; Sins, Cinepol; Zug, Seehof (d)ContradictZwei Schweizer Filmemacher fangen sechs junge, mutige und unkonventionelle musikalische Stimmen in der ghanaischen Hauptstadt Accra ein. Ob Rapper, Soundtüftler oder R’n’B-Sängerin, stellen sie das westliche Afrikabild infrage und drängen auf Veränderung. Ist der Film auch etwas unstrukturiert und der berndeutsche Kommentar gewöhnungsbedürftig, Protagonisten, Sound und Kamera sind verheissungsvoll. (Ab 16) regLuzern, Stattkino (OV)Wer sind wir?Der Basler Regisseur Edgar Hagen begleitet zwei junge Menschen mit Behinderung und ihre Eltern ein Stück durchs Leben. Im Zentrum steht die Frage nach der Kom-munikation. Die Kamera bewegt sich weitgehend auf Augenhöhe der Protagonisten. In seinen Beobachtungen ist der Dokumentarfilm feinfühlig und erläuternd, doch fehlt ihm insgesamt etwas der Zusammenhang. (Ab 12) igLuzern, Bourbaki; Schwyz, Mythen-Forum; Zug, Gotthard (d/CH-d)BombshellDrei Angestellte wehren sich gegen den herrschenden Sexismus beim US-Nachrichtensender Fox News unter Roger Ailes. Das Thema ist interessant und wichtig, die Schauspielerinnen sind top, doch der Film verpasst es, tiefer zu schürfen, und bleibt selber an der sensationshungrigen Oberfläche haften. (Ab 14) reg/pdLuzern, Capitol (e); Emmenbrücke, Maxx (d); Muotathal, Kino: 15./16.2., 20.00 (d); Schwyz, Mythen-Forum (d); Zug, Seehof (e)Die Wolf-GängFantasy-Spass für die ganze Familie von Tim Trageser («Hilfe, ich hab meine Eltern geschrumpft»), basierend auf der Jugendroman- und Hörbuchreihe von Wolfgang Hohlbein. (Ab 6) dpaLuzern, Capitol; Einsiedeln, Cinéboxx; Emmenbrücke, Maxx; Schöftland, Cinema 8; Schwyz, Mythen-Forum; Sins, Cinepol; Stans, Afm Cinema (d)1917Zwei britische Soldaten erhalten den Auftrag, feindliche Linien zu durchqueren, um eine britische Division vor einem Täuschungsmanöver der Deutschen zu warnen. Die Kamera folgt den Protagonisten auf Schritt und Tritt; in Echtzeit, mit nur einem sichtbaren Schnitt, vermittelt Regisseur Sam Mendes die Grausamkeit des Ersten Weltkriegs. Am Schluss überwiegt der Eindruck der schnulzigen Heldengeschichte. (Ab 14) dfuLuzern, Bourbaki (e); Emmenbrücke, Maxx (d); Schöftland, Cinema 8 (d); Schwyz, Mythen-Forum (d); Sins, Cinepol (d); Zug, Seehof (e)The Two PopesDer Netflix-Film thematisiert die Beziehung zwischen Papst Benedikt XVI. (Anthony Hopkins) und Kardinal Jorge Bergoglio (Jonathan Pryce). Das wortlastige Kammerspiel erzählt, wie es kam, dass Joseph Ratzinger ausgerechnet seinem grössten Gegner auf dem Heiligen Stuhl Platz machte – als Franziskus. (Ab 16) dfuLuzern, Bourbaki, am Sonntag (OV)Latte Igel und der magische WassersteinTierisches Animationsabenteuer über die mutige Igeldame Latte und Eichhörnchen Tjum, die zum Bärenkönig aufbrechen, um den Wald wieder mit Wasser zu versorgen. Optisch nicht ganz auf der Höhe, ist die Geschichte spannend, wenn auch etwas überladen. (Ab 0/3) reg/pdLuzern, Bourbaki, am Samstag (d)Spione Undercover (Spies In Disguise)Ein heiteres, aber anspruchsloses Animationsabenteuer. Leider gibt es keine Möglichkeit, den Film mit den tollen Originalstimmen zu sehen. Aber er ist lustig, flott und familienfreundlich genug für einen zufriedenstellenden Kinobesuch. (Ab 6/8) reg/pdLuzern, Capitol; Muotathal, Kino: 8./9.2., 17.00; Schöftland, Cinema 8; Schwyz, Mythen-Forum; Sins, Cinepol; Zug, Seehof (d)Star Wars: The Rise Of SkywalkerDas Finale ist gespickt mit Verweisen auf die älteren Filme, Ironie und epischen Schlachten. Die Crew um J.J. Abrams erweckte die im Jahr 2016 verstorbene Carrie Fisher, Prinzessin Leia, mittels alter, noch nie gesehener Aufnahmen zum Leben. Adam Driver verleiht seiner Figur Kylo Ren eine wohltuende Tiefe in der rasend schnellen Bilderflut. Und Imperator Palpatine hat sein Comeback. (Ab 12) dfuLuzern, Capitol (d); Emmenbrücke, Maxx (d)Bruno Manser: Die Stimme des RegenwaldesÜber weite Strecken ein etwas romantisiertes, aber durchaus unterhaltsames Werk. Doch gegen Ende bedient Niklaus Hilbers Film dasselbe unsägliche Stereotyp wie schon «Der mit dem Wolf tanzt» oder jüngst «Green Book». So erscheint Bruno Manser als weisser Retter, der den Indigenen Nachhilfestunden in deren eigener Kultur gibt. (Ab 12) D.P.Luzern, Bourbaki (OV); Stans, Afm Cinema (CH-d)Das perfekte GeheimnisNun auch noch ein deutsches Remake der erfolgreichen italienischen Komödie mit der Prämisse: In einer Freundesrunde werden alle Handys auf den Tisch gelegt. Trotz mancher Klischees ein amüsanter Film mit überraschenden Wendungen. Bora Dagtekins («Fack ju Göhte») Drehbuch punktet mit Wortwitz, treffsicheren Dialogen und viel Situationskomik. (Ab 12) dpaLuzern, Capitol; Emmenbrücke, Maxx (d)Die fantastische Reise des Dr. DolittleStars wie Robert Downey Jr. als titelgebender Tierarzt müssen sich durch ein Drehbuch quälen, das wenigstens flott vor sich hin schnurrt, aber dabei auch jeglichen Charme vermissen lässt. (Ab 6) dpaLuzern, Capitol (d+e); Baar, Lux (d); Emmenbrücke, Maxx (d); Engelberg, Kino (d); Schöftland, Cinema 8 (d); Schwyz, Mythen-Forum (d); Sins, Cinepol (d); Stans, Afm Cinema (d)CountdownUS-Grusel rund um Sterbe-App, den man recht schnell wieder vergisst, auch der idiotischen Story wegen. (Ab 16) dpaEmmenbrücke, Maxx (d)OHNE WERTUNGDas geheime Leben der BäumeZu Naturaufnahmen erklärt Peter Wohlleben, Autor des gleichnamigen Buchs, aus dem Off das Zusammenspiel der Bäume. (Ab 6) dpaLuzern, Bourbaki; Schöftland, Cinema 8; Sins, Cinepol; Stans, Afm Cinema; Zug, Seehof (d)Die HochzeitNach «Klassentreffen 1.0 – Die unglaubliche Reise der Silberrücken» suchen die drei Schulfreunde Thomas, Nils und Andreas immer noch nach der grossen Liebe. Von und mit Til Schweiger. (Ab 12)Luzern, Capitol; Einsiedeln, Cinéboxx; Emmenbrücke, Maxx; Schöftland, Cinema 8; Sins, Cinepol; Stans, Afm Cinema (d)Spitteler ReloadedDer Dokumentarfilm des Luzerners Jörg Huwyler zeigt Leben und Werk des Schriftstellers, aber auch moderne Annäherungen. (Ab 16) areLuzern, Bourbaki (d)Bad Boys For LifeWill Smith und Martin Lawrence wieder in Action. (Ab 16)Luzern, Capitol (e+d); Baar, Lux (d); Emmenbrücke, Maxx (d); Muotathal, Kino: 8./9.2., 20.00 (d); Schöftland, Cinema 8 (d); Schwyz, Mythen-Forum (d)Vier zauberhafte SchwesternDie magischen Abenteuer aus den Kinderbüchern im Kino. (Ab 6)Einsiedeln, Cinéboxx; Schöftland, Cinema 8; Schwyz, Mythen-Forum; Sins, Cinepol; Stans, Afm Cinema; Zug, Seehof (d)Der kleine Rabe Socke 3«Die Suche nach dem verlorenen Schatz». (Ab 4)Schwyz, Mythen-Forum; Sins, Cinepol; Stans, Afm Cinema (d)Jumanji: The Next LevelDas neuste Action-Abenteuer der Jumanji-Gang um Dwayne Johnson, Jack Black, Kevin Hart und Karen Gillan. (Ab 12)Emmenbrücke, Maxx; Schöftland, Cinema 8 (d)Weitere VorführungenBirds Of PreyVorpremiere (ab 14)Baar, Lux: Mi 20.15 (d); Schöftland, Cinema 8: Mi 20.15 (d); Schwyz, Mythen-Forum: Mi 20.15 (d); Sins, Cinepol: Mi 20.15 (d); Stans, Afm Cinema: Mi 20.15 (d); Zug, Seehof: Mi 20.30 (e)Der Bär in mirAb 6schöftland, Cinema 8: Mo 17.45 (CH-d)In The Name Of Scheherazade Or The First Beergarden In TheranVorpremiere in Anwesenheit der iranischen Regisseurin (ab 16)Luzern, Stattkino: Di 20.15 (OV)Le jeune AhmedStudiofilm AltdorfAltdorf, Cinema Leuzinger: Mi 20.15 (f)Moskau einfach!Vorpremiere/Lunch-Kino (ab 12)Zug, Seehof: Mi 12.15 (CH-d)The AeronautsVorpremiere (ab 10)Luzern, Bourbaki: Mi 12.15 (e)Die Filme werden in der aktuellen Kinowoche (bis 5.Februar) in den genannten Kinos gezeigt. Die Zeiten und die Infos zu den neuen Kinowochen ab jeweils Donnerstag entnehmen Sie der Tageszeitung.Oscarnominiert: Charlize Theron in «Bombshell».Impuls PicturesFrederick Lau in «Nightlife».Warner Bros.VORSCHAUVoraussichtliche Filmstarts vom 6.Februar:A Tale Of Three SistersDrama von Emin Alper.Birds Of Prey«Suicide Squad»-Spin-off von Cathy Yan.In The Name Of Scheherazade Or The First Beergarden In TehranDokumentarfilm von Narges Kalhor.The AeronautsBiografisches Actiondrama von Tom Harper.Voraussichtliche Filmstarts vom 13.Februar:HoneylandDokumentarfilm von Ljubomir Stefanov und Tamara Kotevska.J’accuseHistoriendrama von Roman Polanski.La GomeraKrimikomödie von Corneliu Porumboiu.Moskau Einfach!Komödie von Micha Lewinsky.My Life Is A GunshotBiografischer Dokumentarfilm von Marcel Ramsay.NightlifeRomantische Komödie von Simon Verhoeven.Sonic The HedgehogAbenteuerkomödie mit dem Maskottchen des Spieleherstellers Sega von Jeff Fowler.Tutti insiemiDrama von Ginevra Elkann."
        #    
        #	]

        listTokenSets = []
        listGeotags = []
        for nIndex in range(len(listText)) :
            strUTF8Text = listText[ nIndex ]
            listToken = soton_corenlppy.common_parse_lib.unigram_tokenize_text( text = strUTF8Text, dict_common_config = dictGeospatialConfig )
            listTokenSets.append( listToken )
            listGeotags.append( None )

        listMatchSet = geoparsepy.geo_parse_lib.geoparse_token_set( listTokenSets, indexed_locations, dictGeospatialConfig )

        #strGeom = 'POINT(-1.4052268 50.9369033)'
        #listGeotags[0] = strGeom

        #listMatchGeotag = geoparsepy.geo_parse_lib.reverse_geocode_geom( [strGeom], indexed_geoms, dictGeospatialConfig )
        #if len( listMatchGeotag[0] ) > 0  :
        #	for tupleOSMIDs in listMatchGeotag[0] :
        #		setIndexLoc = osmid_lookup[ tupleOSMIDs ]
        #		for nIndexLoc in setIndexLoc :
        #			strName = cached_locations[nIndexLoc][1]
        #			logger.info( 'Reverse geocoded geotag location [index ' + str(nIndexLoc) + ' osmid ' + repr(tupleOSMIDs) + '] = ' + strName )

        for nIndex in range(len(listMatchSet)) :
            #logger.info( 'Text = ' + listText[nIndex] )
            logger.info( str(processed) + "  --> " + str(nIndex) + " ----> " + filename )
            listMatch = listMatchSet[ nIndex ]
            strGeom = listGeotags[ nIndex ]
        #	setOSMID = set([])
        #	for tupleMatch in listMatch :
        #		nTokenStart = tupleMatch[0]
        #		nTokenEnd = tupleMatch[1]
        #		tuplePhrase = tupleMatch[3]
        #		for tupleOSMIDs in tupleMatch[2] :
        #			setIndexLoc = osmid_lookup[ tupleOSMIDs ]
        #			for nIndexLoc in setIndexLoc :
        #				logger.info( 'Location [index ' + str(nIndexLoc) + ' osmid ' + repr(tupleOSMIDs) + ' @ ' + str(nTokenStart) + ' : ' + str(nTokenEnd) + '] = ' + ' '.join(tuplePhrase) )
        #				break
            listLocMatches = geoparsepy.geo_parse_lib.create_matched_location_list( listMatch, cached_locations, osmid_lookup )
            geoparsepy.geo_parse_lib.filter_matches_by_confidence( listLocMatches, dictGeospatialConfig, geom_context = strGeom, geom_cache = dictGeomResultsCache )
            geoparsepy.geo_parse_lib.filter_matches_by_geom_area( listLocMatches, dictGeospatialConfig )
            geoparsepy.geo_parse_lib.filter_matches_by_region_of_interest( listLocMatches, [-51701], dictGeospatialConfig ) # filter to switzerland
            setOSMID = set([])
            for nMatchIndex in range(len(listLocMatches)) :
                nTokenStart = listLocMatches[nMatchIndex][1]
                nTokenEnd = listLocMatches[nMatchIndex][2]
                tuplePhrase = listLocMatches[nMatchIndex][3]
                strGeom = listLocMatches[nMatchIndex][4]
                tupleOSMID = listLocMatches[nMatchIndex][5]
                dictOSMTags = listLocMatches[nMatchIndex][6]
                if not tupleOSMID in setOSMID :
                    setOSMID.add( tupleOSMID )
                    listNameMultilingual = geoparsepy.geo_parse_lib.calc_multilingual_osm_name_set( dictOSMTags, dictGeospatialConfig )
                    strNameList = ';'.join( listNameMultilingual )
                    strOSMURI = geoparsepy.geo_parse_lib.calc_OSM_uri( tupleOSMID, strGeom )
                    logger.info( 'Disambiguated Location [index ' + str(nMatchIndex) + ' osmid ' + repr(tupleOSMID) + ' @ ' + str(nTokenStart) + ' : ' + str(nTokenEnd) + '] = ' + strNameList + ' : ' + strOSMURI )
                    
                    location_entry = {}
                    location_entry["name-list"] = strNameList
                    location_entry["osm-url"] = strOSMURI
                    jsondata[i]["Location"].append(location_entry)
    
    with open("data_json_hydrated/" + filename, 'w', encoding='utf-8') as f:
        json.dump(jsondata, f, ensure_ascii=False, indent=4)
        